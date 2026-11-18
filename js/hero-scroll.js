/* ==========================================================================
   VIN DES COPAINS — Héros « scroll vidéo » (canvas piloté par le défilement)
   --------------------------------------------------------------------------
   Objectif : un mouvement de caméra parfaitement fluide, sans gel ni retard.
   1. Deux qualités d'images :
      - « légère » (512 px, ~8 Ko, 4 fichiers) : toute la séquence arrive vite,
        la caméra n'est donc jamais bloquée en attendant le réseau
        (une version horizontale pour l'ordinateur, une verticale pour le mobile) ;
      - « haute » (1920 px ordinateur / 720×1080 mobile) : remplace la légère
        au fur et à mesure, en commençant autour de la position du visiteur.
   2. Décodage en parallèle dans plusieurs travailleurs (js/hero-worker.js),
      anticipé dans le sens et à la vitesse du défilement ; le fil principal
      ne fait que dessiner.
   3. Mouvement lissé (amortissement exponentiel), sans aucun fondu (pas de
      double image) ; à l'arrêt, la caméra se pose toujours sur une image
      d'origine de la vidéo (1 image sur 3), la plus nette.
      Pendant le mouvement, si l'image exacte n'est pas encore en haute qualité,
      on montre la voisine en haute qualité plutôt que la version légère.
   4. Plein écran partout, caméra fixe et centrée :
      - ordinateur : images 16:9 (1920 px) ;
      - mobile portrait : images verticales préparées pour le téléphone
        (recadrage centré 2:3, toute la hauteur de la vidéo), plein écran.
   Secours : ouvert depuis un dossier (file://), images classiques.
   ========================================================================== */
(function () {
  "use strict";

  var root = document.querySelector("[data-hero-scroll]");
  if (!root) return;

  var N = parseInt(root.getAttribute("data-frames"), 10) || 297;
  // Images d'origine de la vidéo (les plus nettes) : liste fournie par js/hero-time.js (window.HERO_KEYS),
  // sinon 1 image sur data-key-step. Entre deux images d'origine, les images calculées sont réparties
  // régulièrement : le défilement avance donc la vidéo à vitesse constante, quel que soit leur nombre.
  var KEYS = (function () {
    var k = window.HERO_KEYS, step = parseInt(root.getAttribute("data-key-step"), 10) || 1, a = [];
    if (k && k.length > 1 && k[0] === 0 && k[k.length - 1] === N - 1) return k;
    for (var i = 0; i < N; i += step) a.push(i);
    if (a[a.length - 1] !== N - 1) a.push(N - 1);
    return a;
  })();
  var SNAP = KEYS.length < N;                   // se poser sur une image d'origine à l'arrêt
  var REST_MS = 140;                            // sans défilement depuis 140 ms = arrêt
  var BATCH = 24, BATCH_DELAY = 120;            // haute qualité : lots de 24 toutes les 120 ms
  var MOBILE_MAX = 1024;
  var HI_WIN = 14, LO_WIN = 48, AHEAD = 14;     // fenêtres de décodage (images)
  var cores = navigator.hardwareConcurrency || 4;
  var POOL = Math.max(1, Math.min(3, cores - 1));
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var SMOOTH = reduceMotion ? 30 : 8;           // mobile (doigt, défilement continu) : rattrapage ~0,12 s
  // ordinateur (molette qui avance par crans) : « ressort » amorti — la vitesse varie en douceur,
  // la caméra glisse d'un cran à l'autre au lieu de démarrer et s'arrêter à chaque cran
  var OMEGA = reduceMotion ? 30 : (parseFloat(root.getAttribute("data-omega")) || 7.5);
  var PACKS_EN_COURS = 2;                       // paquets haute qualité téléchargés en même temps

  var canvas = root.querySelector("canvas");
  var ctx = canvas.getContext("2d", { alpha: false });
  var introEl = root.querySelector("[data-hero-intro]");
  var outroEl = root.querySelector("[data-hero-outro]");
  var siteTop = document.getElementById("site-top");
  var sticky = root.querySelector(".hero-sticky");

  var SRC = {
    lo: { path: root.getAttribute("data-src-lo") || "assets/hero-frames-lo/", size: dims(root.getAttribute("data-size-lo"), [512, 288]) },
    "lo-mobile": { path: "", size: dims(root.getAttribute("data-size-lo-mobile"), [288, 432]) },
    desktop: { path: root.getAttribute("data-src-desktop") || "assets/hero-frames/", size: dims(root.getAttribute("data-size-desktop"), [1920, 1080]) },
    mobile: { path: root.getAttribute("data-src-mobile") || "assets/hero-frames-m/", size: dims(root.getAttribute("data-size-mobile"), [720, 1080]) }
  };

  // --- état ---
  var mode = "", gen = 0, modeGen = 0;         // mode : "desktop" | "mobile" ; gen = décodages, modeGen = téléchargements
  var blobs = { lo: [], hi: [] }, fetching = { lo: [], hi: [] }, imgs = { lo: [], hi: [] };
  var hiMap = new Map(), loMap = new Map(), inflight = new Set();
  var packCache = {}, hiOpts = null, hiOptsKey = "";
  var target = 0, pos = 0, prevPos = 0, vel = 0, lastT = 0, running = false, last = "", lastScroll = 0;
  var spd = 0, rawPrev = 0, travel = 1, hold = null;   // vitesse du ressort, sens du défilement, image d'arrêt
  var hiPacksBusy = 0;
  var cw = 0, ch = 0, dpr = 1, rootTop = 0, rootH = 0, stickyH = 0;
  var hiTimer = 0, loReady = false;

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
    delete packCache[name + n];                    // les images sont copiées : le paquet brut peut être libéré
  }
  function release(bm) { if (bm && bm.close) bm.close(); }
  function categorie() {
    // mobile = petit écran tenu en portrait ; à l'horizontale, l'image plein écran convient
    var portrait = window.innerHeight >= window.innerWidth ||
      !!(window.matchMedia && window.matchMedia("(orientation: portrait)").matches);
    return window.innerWidth < MOBILE_MAX && portrait ? "mobile" : "desktop";
  }
  function loName() { return mode === "mobile" && packs("lo-mobile") ? "lo-mobile" : "lo"; }
  function srcName(tier) { return tier === "lo" ? loName() : mode; }

  /* ---------- Décodeurs ---------- */
  var canFetch = location.protocol !== "file:" && !!window.fetch;
  var hasLo = false;                              // version légère disponible (paquets) — selon le mode
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
    if (pk && pk.first && i === 0) {               // image 1 seule (petit fichier) : affichée sans attendre un paquet entier
      p = fetch(abs(pk.first)).then(function (r) {
        if (!r.ok) throw new Error(r.status);
        return r.blob();
      });
    } else if (pk) {
      var f = pk.frames[i];
      p = fetchPack(name, f[0]).then(function (buf) {
        if (g !== modeGen) return null;           // le mode a changé entre-temps : on ne mélange jamais les formats
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
      if (g !== modeGen) return;                    // changement ordinateur ↔ mobile entre-temps (tableaux remplacés)
      fetching[tier][i] = false;
      if (b) blobs[tier][i] = b;
      pump();
    }, function () { if (g === modeGen) fetching[tier][i] = false; });
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
      // paquets : téléchargés seulement par loadLo() et packLoop(), dans l'ordre de priorité
      // (sinon un défilement rapide réclamerait tous les paquets d'un coup et tout arriverait en retard)
      if (canFetch && packs(srcName(tier))) return;
      if (tier === "lo" || loReady || !hasLo || i === Math.round(pos)) fetchBlob(tier, i, true);
      return;
    }
    inflight.add(key);
    if (pool.length) {
      pool[rr++ % pool.length].postMessage({ tier: tier, i: i, gen: g, blob: blob, opts: opts });
    } else if (window.createImageBitmap) {
      (opts ? createImageBitmap(blob, opts).catch(function () { return createImageBitmap(blob); }) : createImageBitmap(blob))
        .then(function (bm) { inflight.delete(key); accept(tier, i, g, bm); pump(); },
              function () { inflight.delete(key); });
    } else {                                       // très anciens navigateurs : image classique
      var im = new Image(), u = URL.createObjectURL(blob);
      im.onload = function () {
        (im.decode ? im.decode().catch(function () {}) : Promise.resolve()).then(function () {
          URL.revokeObjectURL(u); inflight.delete(key); accept(tier, i, g, im); pump();
        });
      };
      im.onerror = function () { URL.revokeObjectURL(u); inflight.delete(key); };
      im.src = u;
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
    var name = loName(), pk = packs(name), n = 0, g = modeGen;
    (function next() {
      if (g !== modeGen) return;                   // le mode a changé : un autre chargement a pris le relais
      if (n >= pk.packs.length) { loReady = true; scheduleHi(); return; }
      var k = n++;
      fetchPack(name, k).then(function (buf) {
        if (g !== modeGen) return;
        unpack("lo", name, k, buf); pump(); kick();
        if (k === 0) scheduleHi();                 // 1er paquet reçu (on peut déjà bouger) : la haute qualité démarre
        next();
      }, next);
    })();
  }
  function hiPackDone(n) {                       // toutes les images du paquet n sont-elles là ?
    var fr = packs(mode).frames;
    for (var j = 0; j < fr.length; j++) if (fr[j][0] === n && !blobs.hi[j]) return false;
    return true;
  }
  function nextHiPack() {
    // le paquet de la position actuelle d'abord, puis vers l'avant (2 pour 1 vers l'arrière)
    var pk = packs(mode), np = pk.packs.length, c = pk.frames[Math.min(N - 1, Math.round(target))][0];
    var dir = target >= pos ? 1 : -1, order = [c], f = 1, b = 1;
    while (order.length < np) {
      for (var r = 0; r < 2; r++) { var a = c + dir * f++; if (a >= 0 && a < np) order.push(a); }
      var z = c - dir * b++; if (z >= 0 && z < np) order.push(z);
      if (f > np && b > np) break;
    }
    for (var k = 0; k < order.length; k++) {
      var n = order[k];
      if (!hiPackBusy[n] && !hiPackDone(n)) return n;
    }
    return -1;
  }
  var hiPackBusy = {};
  function packLoop() {
    var g = modeGen, name = mode;
    // pendant le chargement de la version légère : 1 paquet net à la fois (le début de la visite), ensuite 2
    while (hiPacksBusy < (loReady || !hasLo ? PACKS_EN_COURS : 1)) {
      var n = nextHiPack();
      if (n < 0) return;
      hiPackBusy[n] = true; hiPacksBusy++;
      (function (n) {
        fetchPack(name, n).then(function (buf) {
          if (g !== modeGen) return;
          unpack("hi", name, n, buf);
          hiPackBusy[n] = false; hiPacksBusy--;
          pump(); kick(); packLoop();
        }, function () {
          if (g !== modeGen) return;
          hiPackBusy[n] = false; hiPacksBusy--;
          hiTimer = setTimeout(packLoop, 800);     // nouvel essai un peu plus tard
        });
      })(n);
    }
  }
  function scheduleHi() {
    clearTimeout(hiTimer);
    if (!canFetch) return;                        // (ouvert depuis un dossier : chargement à la demande dans decode())
    if (canFetch && packs(mode)) { packLoop(); return; }
    if (hasLo && !loReady) return;                // (sans paquets) la version légère d'abord
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
    // plein écran (cover), centré : le cadre ne bouge jamais
    var iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
    var s = Math.max(cw / iw, ch / ih), dw = iw * s, dh = ih * s;
    return [(cw - dw) / 2, (ch - dh) / 2, dw, dh];
  }
  function draw(img, lo) {
    var r = rect(img);
    // version légère (déjà floue) : filtre simple ; haute qualité : filtre fin
    ctx.imageSmoothingQuality = lo ? "low" : "high";
    ctx.drawImage(img, r[0], r[1], r[2], r[3]);
  }
  function pick(i) {
    // haute qualité exacte, sinon voisine en haute qualité (nette), sinon version légère
    if (hiMap.has(i)) return [hiMap.get(i), "h" + i];
    var dir = target >= pos ? 1 : -1;
    for (var d = 1; d <= 2; d++) {
      if (hiMap.has(i + dir * d)) return [hiMap.get(i + dir * d), "h" + (i + dir * d)];
      if (hiMap.has(i - dir * d)) return [hiMap.get(i - dir * d), "h" + (i - dir * d)];
    }
    if (loMap.has(i)) return [loMap.get(i), "l" + i];
    var n = nearest(i);
    return n ? [n, "n" + i] : null;
  }
  function render() {
    var p = pick(Math.round(pos));
    if (!p || p[1] === last) return;
    last = p[1];
    draw(p[0], p[1].charAt(0) !== "h");
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
    // à l'arrêt : on se pose sur l'image d'origine suivante, dans le sens du mouvement (jamais de recul)
    if (SNAP && now - lastScroll > REST_MS) { var k = snap(target); if (k !== target) { target = k; hold = k; } }
    if (mode === "mobile") {
      var diff = target - pos;
      pos = Math.abs(diff) < 0.003 ? target : pos + diff * (1 - Math.exp(-SMOOTH * dt));
    } else {
      // ressort critiquement amorti (calcul exact, stable quel que soit l'intervalle entre deux images)
      var x = pos - target, e = Math.exp(-OMEGA * dt), c = spd + OMEGA * x;
      var nx = (x + c * dt) * e;
      spd = (spd - OMEGA * c * dt) * e;
      // on ne dépasse jamais la cible (sinon la caméra reculerait) ; arrivée = arrêt net mais à vitesse quasi nulle
      if (nx * x < 0 || (Math.abs(nx) < 0.003 && Math.abs(spd) < 0.05)) { nx = 0; spd = 0; }
      pos = target + nx;
    }
    var sp = Math.abs(pos - prevPos);
    vel = vel * 0.7 + sp * 0.3;
    render();
    overlays();
    pump();
    if (pos !== target || (SNAP && snap(target) !== target)) requestAnimationFrame(loop);
    else { running = false; lastT = 0; vel = 0; spd = 0; }
  }
  function seg(t) {                               // indice k tel que KEYS[k] <= t <= KEYS[k+1]
    var lo = 0, hi = KEYS.length - 2;
    while (lo < hi) { var m = (lo + hi + 1) >> 1; if (KEYS[m] <= t) lo = m; else hi = m - 1; }
    return lo;
  }
  function snap(t) {                              // image d'origine suivante dans le sens du défilement
    t = Math.max(0, Math.min(N - 1, t));
    var k = seg(t), a = KEYS[k], b = KEYS[k + 1];
    if (t <= a + 1e-6) return a;
    if (t >= b - 1e-6) return b;
    return travel >= 0 ? b : a;
  }
  function frameOf(tau) {                         // temps de la vidéo (en images d'origine) -> indice d'image
    var k = Math.min(KEYS.length - 2, Math.floor(tau)), f = tau - k;
    return KEYS[k] + f * (KEYS[k + 1] - KEYS[k]);
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
    stickyH = sticky ? sticky.offsetHeight : window.innerHeight;
  }
  function readTarget() {
    // course = hauteur de la section − hauteur de l'écran collant (fixe : ne bouge pas avec la barre d'adresse)
    var y = window.pageYOffset, total = rootH - stickyH;
    var p = total > 0 ? Math.min(1, Math.max(0, (y - rootTop) / total)) : 0;
    var raw = frameOf(p * (KEYS.length - 1));     // vitesse constante de la vidéo, quel que soit le nombre d'images
    if (raw !== rawPrev) travel = raw > rawPrev ? 1 : -1;
    // posée un peu plus loin (image d'origine suivante) : quand on reprend dans le même sens, on ne recule pas
    if (hold !== null && (raw === rawPrev || (travel > 0 && raw > rawPrev && raw < hold) || (travel < 0 && raw < rawPrev && raw > hold))) target = hold;
    else { hold = null; target = raw; }
    rawPrev = raw;
    // en-tête transparent seulement tant que l'écran de la visite est fixé ; dès qu'il s'en va, en-tête plein
    // (sinon les textes de fin passeraient sous le logo)
    if (siteTop) siteTop.classList.toggle("in-hero", y < rootTop + rootH - stickyH - 1);
  }
  function onScroll() { lastScroll = performance.now(); readTarget(); kick(); }

  /* ---------- Taille du canvas, mode ordinateur / mobile ---------- */
  function resize() {
    var cat = categorie();
    root.classList.toggle("is-mobile", cat === "mobile");
    var w = canvas.clientWidth, h = canvas.clientHeight, sz = SRC[cat].size;
    // résolution plafonnée à celle de l'image source : au-delà, aucun détail en plus
    var srcRatio = 1 / Math.max(w / sz[0], h / sz[1]);
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
    mode = cat; gen++; modeGen++;
    clearTimeout(hiTimer);
    hiMap.forEach(release); hiMap.clear(); loMap.forEach(release); loMap.clear(); inflight.clear();
    blobs = { lo: [], hi: [] }; fetching = { lo: [], hi: [] }; imgs = { lo: [], hi: [] };
    hiOptsKey = ""; last = ""; loReady = false; hiPackBusy = {}; hiPacksBusy = 0;
    packCache = {};                               // paquets de l'autre mode : libérés
    hasLo = canFetch && !!packs(loName());
    fetchBlob("hi", 0, true);                     // image 1 en priorité absolue
    fetchBlob("hi", Math.round(target), true);
    if (hasLo) loadLo();                          // la version légère d'abord (1er paquet = toute la séquence, 1 image sur 4)…
    else scheduleHi();                            // …la haute qualité démarre dès ce 1er paquet reçu
  }

  // lecture seule, pour les mesures
  root.heroState = function () {
    var i = Math.round(pos), shown = hiMap.has(i) ? "haute" : loMap.has(i) ? "légère" : "absente";
    return { pos: pos, target: target, mode: mode, loReady: loReady, decodeurs: pool.length, haute: hiMap.size, legere: loMap.size, imageCourante: shown, lastKey: last };
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", function () {
    resize(); measure(); startMode(); updateHiOpts(); readTarget();
    last = ""; pump(); kick();
  });
  window.addEventListener("load", function () { measure(); readTarget(); kick(); });
  // nouvelle arrivée sur la page (voir le script en tête de page) : la caméra revient d'un coup à la 1re image
  window.addEventListener("vdc:debut", function () {
    measure(); hold = null; readTarget();
    pos = prevPos = target; spd = 0; vel = 0; last = "";
    overlays(); pump(); kick();
  });

  resize();
  measure();
  readTarget();
  pos = prevPos = rawPrev = target;
  startMode();
  updateHiOpts();
  overlays();
  pump();
  kick();
})();
