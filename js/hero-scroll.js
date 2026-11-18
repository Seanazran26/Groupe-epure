/* ==========================================================================
   VIN DES COPAINS — Héros « scroll vidéo » (canvas piloté par le défilement)
   --------------------------------------------------------------------------
   Pour un rendu parfaitement fluide :
   1. Lissage : l'image affichée « glisse » vers la position du scroll
      (amortissement exponentiel indépendant de la fréquence d'écran)
      au lieu de sauter d'un coup à chaque cran de molette.
   2. Fondu entre deux images voisines quand on défile lentement
      (position 112,4 → image 112 + image 113 à 40 %) ; une seule image
      quand on défile vite (le fondu y est invisible, on économise).
   3. Téléchargement et décodage dans un travailleur en arrière-plan
      (js/hero-worker.js) : le fil principal ne fait que dessiner.
      Seules les images autour de la position courante sont décodées.
   4. Boucle requestAnimationFrame active seulement pendant le mouvement.
   Secours : ouvert directement depuis un dossier (file://), le navigateur
   interdit le travailleur → images classiques décodées à l'avance.
   Jeux : ordinateur 16:9 (1920 px) / mobile portrait (recadrage central
   9:16 en résolution native, 608 × 1080 px).
   ========================================================================== */
(function () {
  "use strict";

  var root = document.querySelector("[data-hero-scroll]");
  if (!root) return;

  var FRAME_COUNT = parseInt(root.getAttribute("data-frames"), 10) || 439;
  var BATCH = 24, BATCH_DELAY = 120;            // préchargement : lots de 24 toutes les 120 ms
  var MOBILE_MAX = 1024;
  var WINDOW = 22;                              // images décodées de part et d'autre
  var DECODE_MAX = Math.max(2, Math.min(4, (navigator.hardwareConcurrency || 4) - 1));
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var SMOOTH = reduceMotion ? 30 : 6.5;         // vitesse de rattrapage (s⁻¹) ≈ 0,15 s
  var FAST = 1.2;                               // au-delà (images par rafraîchissement) : pas de fondu

  var canvas = root.querySelector("canvas");
  var ctx = canvas.getContext("2d", { alpha: false });
  var introEl = root.querySelector("[data-hero-intro]");
  var outroEl = root.querySelector("[data-hero-outro]");
  var siteTop = document.getElementById("site-top");

  var SETS = {
    desktop: { path: root.getAttribute("data-src-desktop") || "assets/hero-frames/", size: dims(root.getAttribute("data-size-desktop"), [1920, 1080]) },
    mobile: { path: root.getAttribute("data-src-mobile") || "assets/hero-frames-sm/", size: dims(root.getAttribute("data-size-mobile"), [608, 1080]) }
  };

  var worker = null, fails = 0;
  var setName = "", setId = 0, gen = 0;
  var bitmaps = new Map(), decoding = new Set(), imgs = [], packCache = {};
  var batchTimer = 0, nextBatch = 1;
  var target = 0, pos = 0, prevPos = 0, lastT = 0, running = false;
  var cw = 0, ch = 0, dpr = 1, decodeOpts = null, decodeKey = "";
  var rootTop = 0, rootH = 0, last = "";

  function dims(attr, def) {
    var m = /^(\d+)x(\d+)$/.exec(attr || "");
    return m ? [+m[1], +m[2]] : def;
  }
  function pad(n) { return ("000" + n).slice(-4); }
  function abs(u) { return new URL(u, location.href).href; }
  function packsOf(set) { return window.HERO_PACKS && window.HERO_PACKS[set]; }
  function categorie() {
    // mobile = petit écran tenu en portrait ; un téléphone à l'horizontale reçoit le jeu 16:9
    return window.innerWidth < MOBILE_MAX && window.innerHeight >= window.innerWidth ? "mobile" : "desktop";
  }
  function release(bm) { if (bm && bm.close) bm.close(); }
  function releaseAll() { bitmaps.forEach(release); bitmaps.clear(); decoding.clear(); }

  /* ---------- Mode principal : travailleur en arrière-plan ---------- */
  if (location.protocol !== "file:" && window.Worker && window.createImageBitmap) {
    try {
      worker = new Worker(root.getAttribute("data-worker") || "js/hero-worker.js");
      worker.onmessage = onWorker;
      worker.onerror = function () { useImages(); };
    } catch (e) { worker = null; }
  }
  function onWorker(e) {
    var m = e.data;
    if (m.type === "bitmap") {
      if (m.setId === setId && m.gen === gen) decoding.delete(m.i);
      if (m.setId !== setId || m.gen !== gen || Math.abs(m.i - Math.round(pos)) > WINDOW + 6) { release(m.bm); }
      else { release(bitmaps.get(m.i)); bitmaps.set(m.i, m.bm); fails = 0; kick(); }
      pump();
    } else if (m.type === "fail" && m.setId === setId && m.gen === gen) {
      decoding.delete(m.i);
      if (++fails > 6) useImages();
    }
  }
  function useImages() {                         // bascule sur le mode de secours
    if (!worker) return;
    try { worker.terminate(); } catch (e) {}
    worker = null;
    setName = "";
    startSet();
    updateDecodeSize();
    pump();
  }

  /* ---------- Mode de secours : images classiques ---------- */
  function fetchPackMain(n) {
    if (!packCache[n]) {
      packCache[n] = fetch(packsOf(setName).packs[n]).then(function (r) { return r.arrayBuffer(); });
    }
    return packCache[n];
  }
  function loadImg(i) {
    if (imgs[i]) return imgs[i];
    var img = new Image(), hp = packsOf(setName);
    img.decoding = "async";
    imgs[i] = img;
    if (hp) {
      var f = hp.frames[i];
      fetchPackMain(f[0]).then(function (buf) {
        img.src = URL.createObjectURL(new Blob([new Uint8Array(buf, f[1], f[2])], { type: "image/webp" }));
      });
    } else {
      img.src = SETS[setName].path + pad(i + 1) + ".webp";
    }
    return img;
  }
  function decodeImg(i) {
    var myGen = gen, img = loadImg(i);
    new Promise(function (res, rej) {
      if (img.complete && img.naturalWidth) return res();
      img.addEventListener("load", res, { once: true });
      img.addEventListener("error", rej, { once: true });
    }).then(function () { return img.decode ? img.decode().catch(function () {}) : null; })
      .then(function () {
        if (myGen !== gen) return;
        decoding.delete(i);
        bitmaps.set(i, img);
        kick(); pump();
      }, function () { if (myGen === gen) decoding.delete(i); });
  }

  /* ---------- Préchargement : image 1 d'abord, puis lots de 24 ---------- */
  function preload(list) {
    list = list.filter(function (i) { return i >= 0 && i < FRAME_COUNT; });
    if (!list.length) return;
    if (worker) worker.postMessage({ type: "fetch", setId: setId, list: list });
    else list.forEach(loadImg);
  }
  function scheduleBatches() {
    clearTimeout(batchTimer);
    (function step() {
      var end = Math.min(FRAME_COUNT, nextBatch + BATCH), list = [];
      for (var i = nextBatch; i < end; i++) list.push(i);
      preload(list);
      nextBatch = end;
      if (nextBatch < FRAME_COUNT) batchTimer = setTimeout(step, BATCH_DELAY);
    })();
  }

  /* ---------- Décodage anticipé autour de la position affichée ---------- */
  function pump() {
    if (!setName) return;
    var center = Math.round(pos), dir = target >= pos ? 1 : -1;
    bitmaps.forEach(function (bm, i) {           // libère ce qui est trop loin
      if (Math.abs(i - center) > WINDOW + 6) { release(bm); bitmaps.delete(i); }
    });
    // l'image courante d'abord, puis surtout celles qui arrivent dans le sens du défilement
    for (var k = 0; k <= WINDOW && decoding.size < DECODE_MAX; k++) {
      want(center + dir * k);
      if (k % 2 === 0) want(center - dir * (k / 2));
    }
  }
  function want(i) {
    if (i < 0 || i >= FRAME_COUNT || bitmaps.has(i) || decoding.has(i) || decoding.size >= DECODE_MAX) return;
    decoding.add(i);
    if (worker) worker.postMessage({ type: "decode", i: i, setId: setId, gen: gen });
    else decodeImg(i);
  }

  /* ---------- Dessin : cover-fit centré (+ fondu quand on défile lentement) ---------- */
  function nearest(i) {
    for (var d = 1; d < FRAME_COUNT; d++) {
      if (bitmaps.has(i - d)) return bitmaps.get(i - d);
      if (bitmaps.has(i + d)) return bitmaps.get(i + d);
    }
    return null;
  }
  function cover(img, alpha) {
    var iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
    var s = Math.max(cw / iw, ch / ih), dw = iw * s, dh = ih * s;
    ctx.globalAlpha = alpha;
    ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
  }
  function render(speed) {
    var i0 = Math.floor(pos), t = pos - i0;
    if (speed > FAST) { i0 = Math.round(pos); t = 0; }
    var a = bitmaps.get(i0), b = t > 0.004 ? bitmaps.get(Math.min(FRAME_COUNT - 1, i0 + 1)) : null;
    var key;
    if (a) key = i0 + ":" + (b ? Math.round(t * 128) : 0);
    else { a = nearest(i0); b = null; key = a ? "n" + i0 : ""; }
    if (!a || key === last) return;
    last = key;
    cover(a, 1);
    if (b) cover(b, t);
    ctx.globalAlpha = 1;
  }
  function overlays() {
    var p = pos / (FRAME_COUNT - 1);
    introEl.classList.toggle("show", p < 0.04);
    outroEl.classList.toggle("show", p > 0.93);
  }

  /* ---------- Boucle d'animation (active seulement pendant le mouvement) ---------- */
  function loop(now) {
    var dt = lastT ? Math.min(0.05, (now - lastT) / 1000) : 1 / 60;
    lastT = now;
    prevPos = pos;
    var diff = target - pos;
    pos = Math.abs(diff) < 0.003 ? target : pos + diff * (1 - Math.exp(-SMOOTH * dt));
    render(Math.abs(pos - prevPos));
    overlays();
    pump();
    if (pos !== target) requestAnimationFrame(loop);
    else { running = false; lastT = 0; }
  }
  function kick() {
    if (running) return;
    running = true; lastT = 0;
    requestAnimationFrame(loop);
  }

  /* ---------- Lecture du scroll (sans recalcul de mise en page) ---------- */
  function measure() {
    var r = root.getBoundingClientRect();
    rootTop = r.top + window.pageYOffset;
    rootH = r.height;
  }
  function readTarget() {
    var y = window.pageYOffset, total = rootH - window.innerHeight;
    var p = total > 0 ? Math.min(1, Math.max(0, (y - rootTop) / total)) : 0;
    target = p * (FRAME_COUNT - 1);
    // l'en-tête reste transparent tant que la vidéo est encore sous lui
    if (siteTop) siteTop.classList.toggle("in-hero", rootTop + rootH - y > siteTop.offsetHeight);
  }
  function onScroll() { readTarget(); kick(); }

  /* ---------- Taille du canvas, choix du jeu d'images ---------- */
  function resize() {
    var w = canvas.clientWidth, h = canvas.clientHeight;
    // Résolution du dessin plafonnée à celle de l'image source : au-delà, on ne gagne aucun
    // détail mais on dessine 2 à 3 fois plus de pixels (téléphones, écrans Retina).
    // L'écran agrandit ensuite le canvas, avec un rendu identique.
    var sz = SETS[categorie()].size, sourceRatio = 1 / Math.max(w / sz[0], h / sz[1]);
    var nd = Math.min(window.devicePixelRatio || 1, 2, sourceRatio);
    if (w === cw && h === ch && nd === dpr) return;  // ignore les faux redimensionnements (barre d'adresse mobile)
    cw = w; ch = h; dpr = nd;
    canvas.width = Math.round(cw * dpr);
    canvas.height = Math.round(ch * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.fillStyle = "#0b0605";
    ctx.fillRect(0, 0, cw, ch);
    last = "";
  }
  function updateDecodeSize() {
    // si l'écran est plus petit que l'image, on décode directement à la taille d'affichage
    var sz = SETS[setName].size, s = Math.max(cw * dpr / sz[0], ch * dpr / sz[1]);
    var opts = worker && s < 0.97 ? { resizeWidth: Math.round(sz[0] * s), resizeHeight: Math.round(sz[1] * s), resizeQuality: "high" } : null;
    var key = setName + (worker ? "w" : "i") + (opts ? opts.resizeWidth : "full");
    if (key === decodeKey) return;
    decodeKey = key; decodeOpts = opts; gen++;
    releaseAll();
    if (worker) worker.postMessage({ type: "opts", opts: opts });
  }
  function startSet() {
    var cat = categorie();
    if (cat === setName) return;
    setName = cat; setId++; gen++;
    clearTimeout(batchTimer);
    releaseAll();
    imgs = []; packCache = {}; nextBatch = 1; decodeKey = ""; last = ""; fails = 0;
    if (worker) {
      var hp = packsOf(setName);
      worker.postMessage({ type: "set", setId: setId, base: abs(SETS[setName].path), packs: hp ? { packs: hp.packs.map(abs), frames: hp.frames } : null });
    }
    preload([0, Math.round(target)]);            // image 1 en priorité absolue, puis la position actuelle
    scheduleBatches();
  }

  // lecture seule, pour les mesures de fluidité
  root.heroState = function () { return { pos: pos, target: target, decoded: bitmaps.size, set: setName, mode: worker ? "travailleur" : "secours" }; };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", function () {
    resize(); measure(); startSet(); updateDecodeSize(); readTarget();
    last = ""; pump(); kick();
  });
  window.addEventListener("load", function () { measure(); readTarget(); kick(); });

  resize();
  measure();
  readTarget();
  pos = prevPos = target;                         // pas d'animation au chargement
  startSet();
  updateDecodeSize();
  overlays();
  pump();
  kick();
})();
