/* ==========================================================================
   VIN DES COPAINS — Travailleur du héros vidéo
   Télécharge les images WebP et les décode en arrière-plan (createImageBitmap),
   puis les transmet prêtes à dessiner : le fil principal ne fait que dessiner.
   ========================================================================== */
"use strict";

var setId = 0, base = "", packs = null, opts = null;
var blobs = [], pending = {}, packCache = {};

function pad(n) { return ("000" + n).slice(-4); }

function fetchPack(n) {
  if (!packCache[n]) {
    packCache[n] = fetch(packs.packs[n]).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.arrayBuffer();
    });
    packCache[n].catch(function () { delete packCache[n]; });
  }
  return packCache[n];
}

function getBlob(i, priority) {
  if (blobs[i]) return Promise.resolve(blobs[i]);
  if (pending[i]) return pending[i];
  var sid = setId, p;
  if (packs) {
    var f = packs.frames[i];
    p = fetchPack(f[0]).then(function (buf) {
      return new Blob([new Uint8Array(buf, f[1], f[2])], { type: "image/webp" });
    });
  } else {
    p = fetch(base + pad(i + 1) + ".webp", { priority: priority ? "high" : "low" }).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.blob();
    });
  }
  pending[i] = p.then(function (b) {
    delete pending[i];
    if (sid === setId) blobs[i] = b;
    return b;
  }, function (e) { delete pending[i]; throw e; });
  return pending[i];
}

onmessage = function (e) {
  var m = e.data;
  if (m.type === "set") {
    setId = m.setId; base = m.base; packs = m.packs || null;
    blobs = []; pending = {}; packCache = {};
  } else if (m.type === "opts") {
    opts = m.opts;
  } else if (m.type === "fetch") {
    if (m.setId !== setId) return;
    m.list.forEach(function (i) { getBlob(i, false).catch(function () {}); });
  } else if (m.type === "decode") {
    var i = m.i, sid = m.setId, gen = m.gen, o = opts;
    getBlob(i, true).then(function (blob) {
      if (sid !== setId) throw new Error("ancien jeu");
      return o ? createImageBitmap(blob, o).catch(function () { return createImageBitmap(blob); }) : createImageBitmap(blob);
    }).then(function (bm) {
      postMessage({ type: "bitmap", i: i, setId: sid, gen: gen, bm: bm }, [bm]);
    }, function () {
      postMessage({ type: "fail", i: i, setId: sid, gen: gen });
    });
  }
};
