/* ==========================================================================
   VIN DES COPAINS — Décodeur du héros vidéo (plusieurs en parallèle)
   Reçoit une image WebP compressée, la décode hors du fil principal
   et la renvoie prête à dessiner (ImageBitmap).
   - "blob" : createImageBitmap(Blob) — Chrome, Edge, Safari : tout se fait ici.
   - "idec" : WebCodecs ImageDecoder — Firefox : son createImageBitmap(Blob)
     repasse par le fil principal de la page (ce qui fige l'animation sur un
     ordinateur modeste) ; ImageDecoder, lui, décode entièrement ici.
   ========================================================================== */
"use strict";

function viaBlob(m) {
  return m.opts
    ? createImageBitmap(m.blob, m.opts).catch(function () { return createImageBitmap(m.blob); })
    : createImageBitmap(m.blob);
}

function viaDecoder(m) {
  return m.blob.arrayBuffer().then(function (buf) {
    var dec = new ImageDecoder({ data: buf, type: m.blob.type || "image/webp" });
    return dec.decode({ frameIndex: 0 }).then(function (r) {
      var vf = r.image;
      var p = m.opts
        ? createImageBitmap(vf, m.opts).catch(function () { return createImageBitmap(vf); })
        : createImageBitmap(vf);
      return p.then(function (bm) { vf.close(); dec.close(); return bm; },
                    function (e) { vf.close(); dec.close(); throw e; });
    }, function (e) { dec.close(); throw e; });
  });
}

onmessage = function (e) {
  var m = e.data, t0 = performance.now(), p;
  try {
    p = m.via === "idec" && typeof ImageDecoder === "function" ? viaDecoder(m) : viaBlob(m);
  } catch (err) {
    p = Promise.reject(err);
  }
  p.then(function (bm) {
    postMessage({ ok: true, tier: m.tier, i: m.i, gen: m.gen, bm: bm, ms: performance.now() - t0 }, [bm]);
  }, function () {
    postMessage({ ok: false, tier: m.tier, i: m.i, gen: m.gen, via: m.via });
  });
};
