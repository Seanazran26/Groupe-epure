/* ==========================================================================
   VIN DES COPAINS — Héros « scroll vidéo » (canvas piloté par le défilement)
   --------------------------------------------------------------------------
   Objectif : un mouvement de caméra parfaitement fluide, sans gel ni retard.
   1. Deux qualités d'images :
      - « légère » (512 px, ~8 Ko, 4 fichiers) : toute la séquence arrive vite,
        la caméra n'est donc jamais bloquée en attendant le réseau ;
      - « haute » (1920 px ordinateur / 1080 px mobile) : remplace la légère
        au fur et à mesure, en commençant autour de la position du visiteur.
   2. Décodage en parallèle dans plusieurs travailleurs (js/hero-worker.js),
      anticipé dans le sens et à la vitesse du défilement ; le fil principal
      ne fait que dessiner.
   3. Mouvement lissé (amortissement exponentiel) + fondu entre deux images
      voisines quand on défile lentement.
   4. Ordinateur : image plein écran (cover), centrée.
      Mobile portrait : l'image entière sur toute la largeur, centrée, avec
      en fond la même image très floutée et assombrie (rien n'est coupé) ;
      le fond est une image fixe (vignette floutée), mise à jour seulement à l'arrêt.
   Secours : ouvert depuis un dossier (file://), images classiques.
   ========================================================================== */
(function () {
  "use strict";

  var root = document.querySelector("[data-hero-scroll]");
  if (!root) return;

  var N = parseInt(root.getAttribute("data-frames"), 10) || 439;
  var BATCH = 24, BATCH_DELAY = 120;            // haute qualité : lots de 24 toutes les 120 ms
  var MOBILE_MAX = 1024;
  var HI_WIN = 14, LO_WIN = 48, AHEAD = 14;     // fenêtres de décodage (images)
  var cores = navigator.hardwareConcurrency || 4;
  var POOL = Math.max(1, Math.min(3, cores - 1));
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var SMOOTH = reduceMotion ? 30 : 8;           // rattrapage (s⁻¹) : ~0,12 s, réactif sans à-coup
  var FAST = 1.2;                               // au-delà (images par rafraîchissement) : pas de fondu

  var canvas = root.querySelector("canvas");
  var ctx = canvas.getContext("2d", { alpha: false });
  var introEl = root.querySelector("[data-hero-intro]");
  var outroEl = root.querySelector("[data-hero-outro]");
  var siteTop = document.getElementById("site-top");

  var SRC = {
    lo: { path: root.getAttribute("data-src-lo") || "assets/hero-frames-lo/", size: dims(root.getAttribute("data-size-lo"), [640, 360]) },
    desktop: { path: root.getAttribute("data-src-desktop") || "assets/hero-frames/", size: dims(root.getAttribute("data-size-desktop"), [1920, 1080]) },
    mobile: { path: root.getAttribute("data-src-mobile") || "assets/hero-frames-sm/", size: dims(root.getAttribute("data-size-mobile"), [1080, 608]) }
  };

  // --- état ---
  var mode = "", gen = 0, modeGen = 0;         // mode : "desktop" | "mobile" ; gen = décodages, modeGen = téléchargements
  var blobs = { lo: [], hi: [] }, fetching = { lo: [], hi: [] }, imgs = { lo: [], hi: [] };
  var hiMap = new Map(), loMap = new Map(), inflight = new Set();
  var packCache = {}, hiOpts = null, hiOptsKey = "";
  var target = 0, pos = 0, prevPos = 0, vel = 0, lastT = 0, running = false, last = "";
  var cw = 0, ch = 0, dpr = 1, rootTop = 0, rootH = 0, headerH = 80, lastBackdrop = -99;
  var hiTimer = 0, loReady = false;
  // fond flouté (mobile) : petite image agrandie par l'écran lui-même (quasi gratuit)
  // Fond flouté (mobile) : deux vignettes de 96 px agrandies par l'écran, en fondu l'une sur l'autre.
  // Il ne change JAMAIS pendant le mouvement (ce serait coûteux) : seulement à l'arrêt.
  // C'est une IMAGE (et non un canvas) : une image fixe ne coûte rien à l'affichage, un canvas si.
  var blur1 = document.createElement("canvas"), nb = document.createElement("canvas");
  var backs = Array.prototype.slice.call(root.querySelectorAll(".hero-backdrop")), backOn = 0;
  blur1.width = 24; blur1.height = 14; nb.width = 96; nb.height = 54;
  var b1 = blur1.getContext("2d"), nbx = nb.getContext("2d");
  nbx.imageSmoothingQuality = "high";
  var veil = nbx.createLinearGradient(0, 0, 0, 54);
  veil.addColorStop(0, "rgba(11,6,5,.5)"); veil.addColorStop(0.45, "rgba(11,6,5,.22)");
  veil.addColorStop(0.55, "rgba(11,6,5,.22)"); veil.addColorStop(1, "rgba(11,6,5,.6)");

  function dims(a, d) { var m = /^(\d+)x(\d+)$/.exec(a || ""); return m ? [+m[1], +m[2]] : d; }
  function pad(n) { return ("000" + n).slice(-4); }
  function abs(u) { return new URL(u, location.href).href; }
  function packs(name) { return window.HERO_PACKS && window.HERO_PACKS[name]; }
  function unpack(tier, name, n, buf) {          // range toutes les images d'un paquet reçu
    var pk = packs(name), fr = pk.frames;
    for (var j = 0; j < fr.length; j++) {
      if (fr[j][0] !== n || blobs[tier][j]) continue;
      blobs[tier][j] = new Blob([new Uint8Array(buf, fr[j][1], fr[j][2])], { type: "image/webp" });
    }
  }
  function release(bm) { if (bm && bm.close) bm.close(); }
  function categorie() {
    // mobile = petit écran tenu en portrait ; à l'horizontale, l'image plein écran convient
    return window.innerWidth < MOBILE_MAX && window.innerHeight >= window.innerWidth ? "mobile" : "desktop";
  }
  function srcName(tier) { return tier === "lo" ? "lo" : mode; }

  /* ---------- Décodeurs ---------- */
  var canFetch = location.protocol !== "file:" && !!window.fetch;
  var hasLo = canFetch && !!packs("lo");          // version légère disponible (paquets)
  var pool = [], rr = 0;
  if (canFetch && window.Worker && window.createImageBitmap) {
    try {
      for (var w = 0; w < POOL; w++) {
        var wk = new Worker(root.getAttribute("data-worker") || "js/hero-worker.js");
        wk.onmessage = onDecoded;
        wk.onerror = function () { pool = []; };   // en cas d'échec : décodage sur le fil principal
        pool.push(wk);
      }
    } catch (e) { pool = []; }
  }
  function onDecoded(e) {
    var m = e.data;
    inflight.delete(m.tier + m.i);
    if (!m.ok) return;
    accept(m.tier, m.i, m.gen, m.bm);
  }
  function accept(tier, i, g, bm) {
    var c = Math.round(pos);
    var map = tier === "hi" ? hiMap : loMap, win = tier === "hi" ? HI_WIN + 8 : LO_WIN + 12;
    if (g !== gen || Math.abs(i - c) > win) { release(bm); return; }
    release(map.get(i));
    map.set(i, bm);
    if (lastBackdrop < 0) backdrop(Math.round(pos));                        // premier fond dès la première image
    kick();
  }

  /* ---------- Téléchargement ---------- */
  function fetchPack(name, n) {
    var key = name + n;
    if (!packCache[key]) {
      packCache[key] = fetch(abs(packs(name).packs[n])).then(function (r) {
        if (!r.ok) throw new Error(r.status);
        return r.arrayBuffer();
      });
      packCache[key].catch(function () { delete packCache[key]; });
    }
    return packCache[key];
  }
  function fetchBlob(tier, i, priority) {
    if (i < 0 || i >= N || blobs[tier][i] || fetching[tier][i]) return;
    fetching[tier][i] = true;
    var g = modeGen, name = srcName(tier), pk = packs(name), p;
    if (!canFetch) { loadImg(tier, i); return; }
    if (pk) {
      var f = pk.frames[i];
      p = fetchPack(name, f[0]).then(function (buf) {
        unpack(tier, name, f[0], buf);            // un paquet contient plusieurs images : toutes rangées d'un coup
        return blobs[tier][i];
      });
    } else {
      p = fetch(SRC[name].path + pad(i + 1) + ".webp", { priority: priority ? "high" : "low" }).then(function (r) {
        if (!r.ok) throw new Error(r.status);
        return r.blob();
      });
    }
    p.then(function (b) {
      fetching[tier][i] = false;
      if (tier === "hi" && g !== modeGen) return;   // la version légère sert aux deux modes
      blobs[tier][i] = b;
      pump();
    }, function () { fetching[tier][i] = false; });
  }
  function loadImg(tier, i) {                    // mode secours (file://)
    if (imgs[tier][i]) return imgs[tier][i];
    var img = new Image();
    img.decoding = "async";
    img.src = SRC[srcName(tier)].path + pad(i + 1) + ".webp";
    imgs[tier][i] = img;
    return img;
  }

  /* ---------- Décodage anticipé ---------- */
  function decode(tier, i) {
    var key = tier + i;
    if (inflight.has(key) || inflight.size >= Math.max(3, pool.length * 2)) return;
    var opts = tier === "hi" ? hiOpts : null, g = gen;
    if (!canFetch) {                               // secours : <img> + decode()
      var img = loadImg(tier, i);
      inflight.add(key);
      new Promise(function (res, rej) {
        if (img.complete && img.naturalWidth) return res();
        img.addEventListener("load", res, { once: true });
        img.addEventListener("error", rej, { once: true });
      }).then(function () { return img.decode ? img.decode().catch(function () {}) : null; })
        .then(function () { inflight.delete(key); accept(tier, i, g, img); pump(); },
              function () { inflight.delete(key); });
      return;
    }
    var blob = blobs[tier][i];
    if (!blob) {
      if (tier === "lo" || loReady || !hasLo || i === Math.round(pos)) fetchBlob(tier, i, true);
      return;
    }
    inflight.add(key);
    if (pool.length) {
      pool[rr++ % pool.length].postMessage({ tier: tier, i: i, gen: g, blob: blob, opts: opts });
    } else {
      (opts ? createImageBitmap(blob, opts).catch(function () { return createImageBitmap(blob); }) : createImageBitmap(blob))
        .then(function (bm) { inflight.delete(key); accept(tier, i, g, bm); pump(); },
              function () { inflight.delete(key); });
    }
  }

  function candidates() {
    var c = Math.round(pos), dir = target >= pos ? 1 : -1;
    var stride = Math.max(1, Math.round(vel)), seen = {}, list = [];
    function add(i) { if (i >= 0 && i < N && !seen[i]) { seen[i] = 1; list.push(i); } }
    add(c);
    for (var k = 1; k <= AHEAD; k++) add(c + dir * k * stride);   // ce que l'écran va montrer
    add(Math.round(target));                                     // là où l'on se dirige
    for (k = 1; k <= 8; k++) { add(c + dir * k); add(c - dir * k); }
    return list;
  }

  function pump() {
    if (!mode) return;
    var c = Math.round(pos);
    hiMap.forEach(function (bm, i) { if (Math.abs(i - c) > HI_WIN + 8) { release(bm); hiMap.delete(i); } });
    loMap.forEach(function (bm, i) { if (Math.abs(i - c) > LO_WIN + 12) { release(bm); loMap.delete(i); } });
    var list = candidates();
    // 1) que chaque image proche ait au moins sa version légère (décodage quasi instantané)
    if (hasLo) list.forEach(function (i) { if (!hiMap.has(i) && !loMap.has(i)) decode("lo", i); });
    // 2) puis la haute qualité, en priorité autour de la position courante
    list.slice(0, HI_WIN).forEach(function (i) { if (!hiMap.has(i)) decode("hi", i); });
    // 3) pendant les temps calmes, on prépare plus loin la version légère
    if (hasLo && inflight.size < 2) {
      for (var k = 1; k <= LO_WIN; k++) {
        var a = c + k, b = c - k;
        if (a < N && !loMap.has(a) && !hiMap.has(a)) { decode("lo", a); break; }
        if (b >= 0 && !loMap.has(b) && !hiMap.has(b)) { decode("lo", b); break; }
      }
    }
  }

  /* ---------- Préchargement ---------- */
  function loadLo() {
    // paquets l'un après l'autre : le 1er (1 image sur 4 sur toute la vidéo) arrive donc au plus vite
    var pk = packs("lo"), n = 0;
    (function next() {
      if (n >= pk.packs.length) { loReady = true; scheduleHi(); return; }
      var k = n++;
      fetchPack("lo", k).then(function (buf) { unpack("lo", "lo", k, buf); pump(); kick(); next(); }, next);
    })();
  }
  function scheduleHi() {
    clearTimeout(hiTimer);
    (function step() {
      // les 24 images haute qualité manquantes les plus proches (surtout vers l'avant)
      var c = Math.round(target), n = 0, f = 0, b = 1;
      while (n < BATCH && (c + f < N || c - b >= 0)) {
        for (var r = 0; r < 2; r++) {
          var i = c + f++;
          if (i < N && !blobs.hi[i] && !fetching.hi[i]) { fetchBlob("hi", i, false); n++; }
        }
        var j = c - b++;
        if (j >= 0 && !blobs.hi[j] && !fetching.hi[j]) { fetchBlob("hi", j, false); n++; }
      }
      var reste = 0;
      for (var j = 0; j < N; j++) if (!blobs.hi[j]) { reste = 1; break; }
      if (reste) hiTimer = setTimeout(step, BATCH_DELAY);
    })();
  }

  /* ---------- Dessin ---------- */
  function frameAt(i) { return hiMap.get(i) || loMap.get(i) || null; }
  function nearest(i) {
    for (var d = 1; d < N; d++) {
      var a = frameAt(i - d); if (a) return a;
      var b = frameAt(i + d); if (b) return b;
    }
    return null;
  }
  function rect(img) {
    // ordinateur : plein écran ; mobile : le canvas est la bande 16:9 → l'image entière
    var iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
    var s = Math.max(cw / iw, ch / ih), dw = iw * s, dh = ih * s;
    return [(cw - dw) / 2, (ch - dh) / 2, dw, dh];
  }
  function backdrop(i) {
    if (mode !== "mobile" || backs.length < 2 || Math.abs(i - lastBackdrop) < 6) return;
    var img = loMap.get(i) || frameAt(i);
    if (!img) return;
    lastBackdrop = i;
    b1.drawImage(img, 0, 0, 24, 14);              // deux réductions = flou très doux
    nbx.globalAlpha = 1;
    nbx.drawImage(blur1, 0, 0, 96, 54);
    nbx.fillStyle = veil;                         // voile sombre intégré à l'image
    nbx.fillRect(0, 0, 96, 54);
    try {
      nb.toBlob(function (blob) {
        if (!blob) return;
        var next = backs[1 - backOn], prev = backs[backOn], url = URL.createObjectURL(blob);
        next.onload = function () {
          next.classList.add("on");               // fondu d'environ 0,6 s (CSS), puis l'ancienne est masquée
          prev.classList.remove("on");
          backOn = 1 - backOn;
          setTimeout(function () { if (!prev.classList.contains("on") && prev.src) { URL.revokeObjectURL(prev.src); prev.removeAttribute("src"); } }, 900);
        };
        next.src = url;
      }, "image/png");
    } catch (e) {}                                 // (ouvert depuis un dossier : pas de fond flouté)
  }
  function draw(img, alpha, lo) {
    var r = rect(img);
    // version légère (déjà floue) : filtre simple, bien moins coûteux ; haute qualité : filtre fin
    ctx.imageSmoothingQuality = lo ? "low" : "high";
    ctx.globalAlpha = alpha;
    ctx.drawImage(img, r[0], r[1], r[2], r[3]);
  }
  function render(speed) {
    var i0 = Math.floor(pos), t = pos - i0;
    if (speed > FAST) { i0 = Math.round(pos); t = 0; }
    var i1 = Math.min(N - 1, i0 + 1), a = frameAt(i0), aHi = hiMap.has(i0);
    // fondu seulement entre deux images haute qualité (sur la version légère, il ne se verrait pas)
    var b = t > 0.004 && aHi && hiMap.has(i1) ? hiMap.get(i1) : null, key;
    if (a) key = i0 + ":" + (b ? Math.round(t * 128) : 0) + (aHi ? "h" : "l");
    else { a = nearest(i0); b = null; key = a ? "n" + i0 : ""; }
    if (!a || key === last) return;
    last = key;
    draw(a, 1, !aHi && a !== hiMap.get(i0));
    if (b) draw(b, t, false);
    ctx.globalAlpha = 1;
  }
  function overlays() {
    var p = pos / (N - 1);
    introEl.classList.toggle("show", p < 0.04);
    outroEl.classList.toggle("show", p > 0.93);
  }

  /* ---------- Boucle d'animation ---------- */
  function loop(now) {
    var dt = lastT ? Math.min(0.05, (now - lastT) / 1000) : 1 / 60;
    lastT = now;
    prevPos = pos;
    var diff = target - pos;
    pos = Math.abs(diff) < 0.003 ? target : pos + diff * (1 - Math.exp(-SMOOTH * dt));
    var sp = Math.abs(pos - prevPos);
    vel = vel * 0.7 + sp * 0.3;
    render(sp);
    overlays();
    pump();
    if (pos !== target) requestAnimationFrame(loop);
    else { running = false; lastT = 0; vel = 0; backdrop(Math.round(pos)); }   // à l'arrêt seulement
  }
  function kick() {
    if (running) return;
    running = true; lastT = 0;
    requestAnimationFrame(loop);
  }

  /* ---------- Scroll (sans recalcul de mise en page) ---------- */
  function measure() {
    var r = root.getBoundingClientRect();
    rootTop = r.top + window.pageYOffset;
    rootH = r.height;
    if (siteTop) headerH = siteTop.offsetHeight;   // mesuré une fois (le lire à chaque scroll forcerait un recalcul de la page)
  }
  function readTarget() {
    var y = window.pageYOffset, total = rootH - window.innerHeight;
    var p = total > 0 ? Math.min(1, Math.max(0, (y - rootTop) / total)) : 0;
    target = p * (N - 1);
    if (siteTop) siteTop.classList.toggle("in-hero", rootTop + rootH - y > headerH);
  }
  function onScroll() { readTarget(); kick(); }

  /* ---------- Taille du canvas, mode ordinateur / mobile ---------- */
  function resize() {
    var cat = categorie();
    root.classList.toggle("is-mobile", cat === "mobile");
    var w = canvas.clientWidth, h = canvas.clientHeight, sz = SRC[cat].size;
    // résolution plafonnée à celle de l'image source : au-delà, aucun détail en plus
    var srcRatio = cat === "mobile" ? sz[0] / w : 1 / Math.max(w / sz[0], h / sz[1]);
    var nd = Math.min(window.devicePixelRatio || 1, 2, Math.max(1, srcRatio));
    if (w === cw && h === ch && nd === dpr) return false;   // ignore la barre d'adresse mobile
    cw = w; ch = h; dpr = nd;
    canvas.width = Math.round(cw * dpr);
    canvas.height = Math.round(ch * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.fillStyle = "#0b0605";
    ctx.fillRect(0, 0, cw, ch);
    last = "";
    return true;
  }
  function updateHiOpts() {
    // on décode la haute qualité directement à la taille d'affichage quand l'écran est plus petit
    var sz = SRC[mode].size, s = Math.max(cw * dpr / sz[0], ch * dpr / sz[1]);
    var opts = canFetch && s < 0.97 ? { resizeWidth: Math.round(sz[0] * s), resizeHeight: Math.round(sz[1] * s), resizeQuality: "high" } : null;
    var key = mode + (opts ? opts.resizeWidth : "plein");
    if (key === hiOptsKey) return;
    hiOptsKey = key; hiOpts = opts;
    hiMap.forEach(release); hiMap.clear();
    gen++; inflight.clear();
  }
  function startMode() {
    var cat = categorie();
    if (cat === mode) return;
    var first = !mode;
    mode = cat; gen++; modeGen++;
    clearTimeout(hiTimer);
    hiMap.forEach(release); hiMap.clear(); inflight.clear();
    blobs.hi = []; fetching.hi = []; imgs.hi = []; hiOptsKey = ""; last = "";
    fetchBlob("hi", 0, true);                     // image 1 en priorité absolue
    fetchBlob("hi", Math.round(target), true);
    if (first && hasLo) loadLo();                 // la version légère d'abord…
    if (!hasLo || loReady) scheduleHi();          // …puis la haute qualité
  }

  // lecture seule, pour les mesures
  root.heroState = function () {
    var i = Math.round(pos), shown = hiMap.has(i) ? "haute" : loMap.has(i) ? "légère" : "absente";
    return { pos: pos, target: target, mode: mode, decodeurs: pool.length, haute: hiMap.size, legere: loMap.size, imageCourante: shown, lastKey: last };
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", function () {
    resize(); measure(); startMode(); updateHiOpts(); readTarget();
    last = ""; pump(); kick();
  });
  window.addEventListener("load", function () { measure(); readTarget(); kick(); });

  resize();
  measure();
  readTarget();
  pos = prevPos = target;
  startMode();
  updateHiOpts();
  overlays();
  pump();
  kick();
})();
