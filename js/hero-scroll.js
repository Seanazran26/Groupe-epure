/* ==========================================================================
   VIN DES COPAINS — Héros « scroll vidéo » (canvas piloté par le défilement)
   --------------------------------------------------------------------------
   - Conteneur de 320vh ; à l'intérieur, un bloc sticky (100svh) avec un canvas.
   - 297 images WebP : progression du scroll 0 → 1  ⇒  index = round(p × 296).
   - Jeu desktop (1920 px) ou mobile (1080 px) selon la largeur de fenêtre.
   - Préchargement : image 1 en priorité, puis lots de 24 toutes les 120 ms.
   - Aucune mise à jour d'état à chaque frame : variables locales + rAF.
   ========================================================================== */
(function () {
  "use strict";

  var FRAME_COUNT = 297;
  var BATCH = 24, BATCH_DELAY = 120, MOBILE_MAX = 1024;
  var root = document.querySelector("[data-hero-scroll]");
  if (!root) return;

  var canvas = root.querySelector("canvas");
  var ctx = canvas.getContext("2d");
  var introEl = root.querySelector("[data-hero-intro]");
  var outroEl = root.querySelector("[data-hero-outro]");
  var siteTop = document.getElementById("site-top");

  // Dossiers des deux jeux d'images (surchargeables via data-attributs)
  var SETS = {
    desktop: root.getAttribute("data-src-desktop") || "assets/hero-frames/",
    mobile: root.getAttribute("data-src-mobile") || "assets/hero-frames-sm/"
  };
  // Point de cadrage horizontal (0 = gauche, 0.5 = centre, 1 = droite), animé le long
  // de la vidéo. Sur mobile, l'écran ne montre que ~26 % de la largeur : data-focus-mobile
  // fait « suivre » les bouteilles. Sur ordinateur, data-focus (centré par défaut).
  var focusDesktop = parseFocus(root.getAttribute("data-focus"));
  var focusMobile = parseFocus(root.getAttribute("data-focus-mobile") || root.getAttribute("data-focus"));
  var focus = focusDesktop;

  var images = [], loading = [], setName = "", batchTimer = 0, nextBatch = 1;
  var currentIndex = -1, drawnIndex = -1, wanted = 0, ticking = false;
  var cw = 0, ch = 0;

  function pad(n) { return ("000" + n).slice(-4); }
  function categorie() { return window.innerWidth < MOBILE_MAX ? "mobile" : "desktop"; }

  function parseFocus(attr) {
    // Format : "0:0.5, 0.5:0.6, 1:0.55" (progression:position) ou un seul nombre.
    if (!attr) return [[0, 0.5], [1, 0.5]];
    var pts = attr.split(",").map(function (s) {
      var p = s.split(":").map(parseFloat);
      return p.length === 2 ? p : [0, p[0]];
    }).filter(function (p) { return !isNaN(p[0]) && !isNaN(p[1]); });
    if (pts.length === 1) pts.push([1, pts[0][1]]);
    return pts.sort(function (a, b) { return a[0] - b[0]; });
  }
  function focusAt(p) {
    for (var i = 1; i < focus.length; i++) {
      if (p <= focus[i][0]) {
        var a = focus[i - 1], b = focus[i], t = (p - a[0]) / ((b[0] - a[0]) || 1);
        return a[1] + (b[1] - a[1]) * t;
      }
    }
    return focus[focus.length - 1][1];
  }

  /* ---------- Chargement des images ---------- */
  function load(i, priority) {
    if (images[i] || loading[i]) return;
    loading[i] = true;
    var img = new Image();
    img.decoding = "async";
    if (priority && "fetchPriority" in img) img.fetchPriority = "high";
    var mySet = setName;
    img.onload = function () {
      if (mySet !== setName) return;           // le jeu a changé entre-temps
      images[i] = img;
      loading[i] = false;
      if (i === wanted || drawnIndex === -1) requestDraw();
    };
    img.onerror = function () { loading[i] = false; };
    var packs = window.HERO_PACKS && window.HERO_PACKS[setName];
    if (packs) {
      // Mode « paquets » (aperçu en ligne) : 24 images WebP par fichier, découpées en mémoire.
      var f = packs.frames[i];
      fetchPack(mySet, f[0]).then(function (buf) {
        if (mySet !== setName) return;
        img.src = URL.createObjectURL(new Blob([buf.slice(f[1], f[1] + f[2])], { type: "image/webp" }));
      }, function () { loading[i] = false; });
    } else {
      img.src = SETS[setName] + pad(i + 1) + ".webp";
    }
  }

  var packCache = {};
  function fetchPack(set, n) {
    var key = set + n;
    if (!packCache[key]) {
      packCache[key] = fetch(window.HERO_PACKS[set].packs[n]).then(function (r) {
        if (!r.ok) throw new Error(r.status);
        return r.arrayBuffer();
      });
      packCache[key].catch(function () { delete packCache[key]; });
    }
    return packCache[key];
  }

  function scheduleBatches() {
    clearTimeout(batchTimer);
    (function step() {
      var end = Math.min(FRAME_COUNT, nextBatch + BATCH);
      for (var i = nextBatch; i < end; i++) load(i, false);
      nextBatch = end;
      if (nextBatch < FRAME_COUNT) batchTimer = setTimeout(step, BATCH_DELAY);
    })();
  }

  function startSet() {
    var cat = categorie();
    if (cat === setName) return;
    setName = cat;
    focus = cat === "mobile" ? focusMobile : focusDesktop;
    clearTimeout(batchTimer);
    images = []; loading = [];
    nextBatch = 1; drawnIndex = -1;
    load(0, true);                              // image 1 en priorité absolue
    if (wanted > 0) load(wanted, true);
    scheduleBatches();
  }

  /* ---------- Dessin (cover-fit manuel) ---------- */
  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    cw = canvas.clientWidth; ch = canvas.clientHeight;
    canvas.width = Math.round(cw * dpr);
    canvas.height = Math.round(ch * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    drawnIndex = -1;
  }

  function draw(i, p) {
    var img = images[i];
    if (!img) {
      load(i, true);                           // demandée mais pas encore là : priorité
      // en attendant, on garde l'image la plus proche déjà chargée
      for (var d = 1; d < FRAME_COUNT && !img; d++) img = images[i - d] || images[i + d];
      if (!img || drawnIndex !== -1) return;
    }
    var iw = img.naturalWidth, ih = img.naturalHeight;
    var s = Math.max(cw / iw, ch / ih);
    var dw = iw * s, dh = ih * s;
    var dx = (cw - dw) * focusAt(p), dy = (ch - dh) / 2;
    ctx.drawImage(img, dx, dy, dw, dh);
    drawnIndex = images[i] ? i : -2;
  }

  /* ---------- Défilement ---------- */
  function progress(r) {
    var total = r.height - window.innerHeight;
    return total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
  }

  function frame() {
    ticking = false;
    var rect = root.getBoundingClientRect(), p = progress(rect);
    var idx = Math.round(p * (FRAME_COUNT - 1));
    wanted = idx;
    if (idx !== currentIndex || drawnIndex !== idx) {
      currentIndex = idx;
      draw(idx, p);
    }
    introEl.classList.toggle("show", p < 0.04);
    outroEl.classList.toggle("show", p > 0.93);
    // l'en-tête reste transparent tant que la vidéo est encore sous lui
    if (siteTop) siteTop.classList.toggle("in-hero", rect.bottom > siteTop.offsetHeight);
  }
  function requestDraw() {
    if (!ticking) { ticking = true; requestAnimationFrame(frame); }
  }

  window.addEventListener("scroll", requestDraw, { passive: true });
  window.addEventListener("resize", function () {
    resize();
    startSet();                                 // recharge si desktop ⇄ mobile
    requestDraw();
  });

  resize();
  startSet();
  requestDraw();
})();
