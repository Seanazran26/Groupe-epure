/* ==========================================================================
   VIN DES COPAINS — Décodeur du héros vidéo (plusieurs en parallèle)
   Reçoit une image WebP compressée, la décode hors du fil principal
   (createImageBitmap) et la renvoie prête à dessiner.
   ========================================================================== */
"use strict";

onmessage = function (e) {
  var m = e.data;
  var p = m.opts
    ? createImageBitmap(m.blob, m.opts).catch(function () { return createImageBitmap(m.blob); })
    : createImageBitmap(m.blob);
  p.then(function (bm) {
    postMessage({ ok: true, tier: m.tier, i: m.i, gen: m.gen, bm: bm }, [bm]);
  }, function () {
    postMessage({ ok: false, tier: m.tier, i: m.i, gen: m.gen });
  });
};
