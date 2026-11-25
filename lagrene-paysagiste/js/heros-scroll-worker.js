/* ==========================================================================
   Lagrene Paysagiste 59 — décodeur du héros scroll (tourne en arrière-plan)
   Reçoit une image WebP compressée, la décode HORS du fil principal de la
   page et la renvoie prête à dessiner (ImageBitmap) : le défilement ne fige
   jamais pendant un décodage.
   - "blob" : createImageBitmap(Blob)  → Chrome, Edge, Safari
   - "idec" : WebCodecs ImageDecoder   → Firefox (son createImageBitmap(Blob)
              repasse par le fil principal ; ImageDecoder décode ici)
   ========================================================================== */
"use strict";

function viaBlob(blob) {
  return createImageBitmap(blob);
}

function viaDecoder(blob) {
  return blob.arrayBuffer().then(function (buf) {
    var dec = new ImageDecoder({ data: buf, type: blob.type || "image/webp" });
    return dec.decode({ frameIndex: 0 }).then(function (r) {
      var vf = r.image;
      return createImageBitmap(vf).then(
        function (bm) { vf.close(); dec.close(); return bm; },
        function (e) { vf.close(); dec.close(); throw e; }
      );
    }, function (e) { dec.close(); throw e; });
  });
}

onmessage = function (e) {
  var m = e.data, p;
  try {
    p = m.via === "idec" && typeof ImageDecoder === "function" ? viaDecoder(m.blob) : viaBlob(m.blob);
  } catch (err) {
    p = Promise.reject(err);
  }
  p.then(function (bm) {
    postMessage({ ok: true, i: m.i, gen: m.gen, bm: bm }, [bm]);
  }, function () {
    postMessage({ ok: false, i: m.i, gen: m.gen });
  });
};
