/* ==========================================================================
   Lagrene Paysagiste 59 — héros scroll : la vidéo « Votre jardin se
   transforme » avance (et recule) image par image au rythme du défilement.
   --------------------------------------------------------------------------
   Architecture
   - Conteneur .heros-scroll de 320vh ; à l'intérieur, .hs-scene collante
     (top 0, 100svh) qui contient le <canvas> plein écran.
   - 297 images. Progrès = défilement du conteneur (0 → 1), cible =
     round(progrès × 296). On ne redessine QUE si l'image affichée change.
   - « Cover » centré, pixel pour pixel (voir dimensionner), DPR ≤ 2.
   - Jeu mobile si largeur < 1024 px (tenu en portrait) ; changement de
     catégorie au redimensionnement → on vide tout et on recharge le bon jeu.
   - Chargement : image 1 en priorité absolue (dessinée dès son arrivée),
     puis lots de 24 images toutes les 120 ms, dans un ordre ENTRELACÉ
     (1 image sur 16, puis 1 sur 8…) ; à l'arrêt du défilement, l'image
     demandée passe devant tout le monde.
   Fluidité, en avant comme en arrière
   - Décodage HORS du fil principal (workers : createImageBitmap, ou
     ImageDecoder sous Firefox), à l'avance.
   - Mémoire d'images décodées SYMÉTRIQUE : ce qui vient d'être vu reste prêt
     pour un retour en arrière ; on libère d'abord les images les plus
     éloignées. Priorité : le chemin que l'animation va parcourir, puis
     au-delà dans le sens du défilement, puis derrière.
   - Affichage MONOTONE : si l'image exacte n'est pas encore prête, on affiche
     la meilleure image ENTRE l'image actuelle et la cible — jamais une image
     située dans l'autre sens (aucun aller-retour visible).
   - Lissage amorti : à la molette, toutes les images intermédiaires sont jouées.
   - Défilement : écouteur passif + requestAnimationFrame, aucun calcul lourd.
   - Arrivée sur la page : toujours au tout début du héros (sauf lien #ancre).
   - Ouvert depuis un dossier (file://) : mode de secours <img> + decode().
   ========================================================================== */
(function () {
  "use strict";

  var racine = document.querySelector(".heros-scroll");
  if (!racine) return;

  /* ---- Arrivée sur le site : tout en haut, au tout début de la vidéo -------- */
  try { if ("scrollRestoration" in history) history.scrollRestoration = "manual"; } catch (e) {}
  var aInteragi = false;
  ["wheel", "touchstart", "keydown", "mousedown"].forEach(function (t) {
    window.addEventListener(t, function () { aInteragi = true; }, { passive: true, once: true });
  });
  function enHaut() {
    if (location.hash || aInteragi) return;
    try { window.scrollTo({ top: 0, left: 0, behavior: "instant" }); } catch (e) { window.scrollTo(0, 0); }
  }
  enHaut();
  window.addEventListener("load", enHaut);

  var FRAME_COUNT = 297;
  var LOT = 24, DELAI_LOT = 120;               // préchargement : 24 images / 120 ms
  var JEUX = { ordi: "images/hero-frames/", mobile: "images/hero-frames-sm/" };

  var scene = racine.querySelector(".hs-scene");
  var canvas = racine.querySelector("canvas");
  var ctx = canvas.getContext("2d", { alpha: false });
  var debut = racine.querySelector(".hs-debut");
  var fin = racine.querySelector(".hs-fin");

  var parFichier = location.protocol === "file:";
  var GECKO = /firefox/i.test(navigator.userAgent);
  var peutWorker = !parFichier && typeof Worker === "function" && typeof createImageBitmap === "function" && typeof fetch === "function";
  // Décodage : workers « blob » (Chrome, Edge, Safari) ou « idec » (ImageDecoder, Firefox) ; secours « img »
  var VIA = window.HEROS_VIA || (!peutWorker ? "img" : (GECKO ? (typeof ImageDecoder === "function" ? "idec" : "img") : "blob"));

  function categorie() {                       // un téléphone tenu à l'horizontale garde le jeu paysage
    var w = window.innerWidth, h = window.innerHeight;
    return w < 1024 && h >= w * 0.8 ? "mobile" : "ordi";
  }
  function url(jeu, i) { return JEUX[jeu] + String(i + 1).padStart(4, "0") + ".webp"; }

  // Mode « paquets » (attribut data-paquets) : images regroupées par lots dans quelques fichiers
  // (index dans paquets.json). Sert quand l'hébergement limite le nombre de fichiers.
  var MODE_PAQUETS = racine.hasAttribute("data-paquets") && !parFichier;
  var manifestes = {};

  var STATS = window.__herosStats = { charges: 0, decodes: 0, dessins: 0, exacts: 0, approches: 0,
    via: VIA, paquets: MODE_PAQUETS, dessinMax: 0, affiche: -1, cible: 0, memoire: 0 };

  /* ---- Workers de décodage ------------------------------------------------ */
  var workers = [];
  function creerWorkers() {
    if (VIA === "img" || workers.length) return;
    var n = Math.max(1, Math.min(3, (navigator.hardwareConcurrency || 4) - 1));
    try {
      for (var k = 0; k < n; k++) {
        var w = new Worker("js/heros-scroll-worker.js");
        w.charge = 0;
        w.onmessage = surDecode;
        w.onerror = function () { basculerSecours(); };
        workers.push(w);
      }
    } catch (e) { basculerSecours(); }
  }
  function basculerSecours() {                 // si les workers échouent : mode <img>
    if (VIA === "img") return;
    VIA = "img"; STATS.via = VIA;
    workers.forEach(function (w) { w.terminate(); });
    workers = [];
    demarrer(true);
  }

  /* ---- Ordre de chargement entrelacé ---------------------------------------- */
  function ordreEntrelace() {
    var vu = new Uint8Array(FRAME_COUNT), o = [0]; vu[0] = 1;
    [16, 8, 4, 2, 1].forEach(function (pas) {
      for (var i = 0; i < FRAME_COUNT; i += pas) if (!vu[i]) { vu[i] = 1; o.push(i); }
    });
    if (!vu[FRAME_COUNT - 1]) o.push(FRAME_COUNT - 1);
    return o;
  }
  var ORDRE = ordreEntrelace();

  /* ---- État du jeu d'images courant -------------------------------------- */
  var E = null, gen = 0;
  var indexScroll = 0;      // image demandée par la position de défilement
  var position = 0;         // position lissée (nombre décimal)
  var indexCible = 0;       // image que l'on veut afficher maintenant (= position arrondie)
  var indexDessine = -1;    // image réellement affichée
  var sens = 1;             // sens du défilement : 1 en avant, -1 en arrière

  function uniteDe(i) { return E.man ? E.uniteDe[i] : i; }
  function imagesDe(u) { return E.man ? E.man.fichiers[u].i : [u]; }

  function nouvelEtat(jeu, man) {
    var nbU = man ? man.fichiers.length : FRAME_COUNT, uDe = null;
    if (man) { uDe = new Int16Array(FRAME_COUNT); man.fichiers.forEach(function (f, u) { f.i.forEach(function (i) { uDe[i] = u; }); }); }
    return { jeu: jeu, gen: ++gen, man: man, uniteDe: uDe, donnees: new Array(FRAME_COUNT), statut: new Uint8Array(FRAME_COUNT),
             uStatut: new Uint8Array(nbU), nbU: nbU, file: [], prio: [], enVol: 0, libres: 0, minuteur: 0,
             decodes: new Map(), enDecodage: new Set(), octets: 0 };
  }

  /* ---- Chargement des octets (réseau) ------------------------------------- */
  function demarrer(forcer) {
    var jeu = categorie();
    if (E && E.jeu === jeu && !forcer) return;
    if (E) viderEtat(E);
    E = null;
    creerWorkers();
    indexDessine = -1; STATS.affiche = -1;
    if (!MODE_PAQUETS) return lancer(jeu, null);
    if (manifestes[jeu]) return lancer(jeu, manifestes[jeu]);
    var g = ++gen;
    fetch(JEUX[jeu] + "paquets.json").then(function (r) { return r.json(); }).then(function (m) {
      manifestes[jeu] = m;
      if (g === gen) lancer(jeu, m);
    }, function () { setTimeout(function () { if (g === gen) demarrer(true); }, 1500); });
  }

  function lancer(jeu, man) {
    E = nouvelEtat(jeu, man);
    var etat = E;
    etat.prio.push(uniteDe(0));                  // image 1 en priorité absolue
    if (etat.man) { for (var u = 0; u < etat.nbU; u++) if (u !== uniteDe(0)) etat.file.push(u); }
    else ORDRE.forEach(function (i) { if (i !== 0) etat.file.push(i); });
    pomper();
    etat.minuteur = setInterval(function () {     // lots de 24 images toutes les 120 ms
      if (etat !== E) return clearInterval(etat.minuteur);
      etat.libres += etat.man ? 1 : LOT;
      pomper();
      if (!etat.file.length) clearInterval(etat.minuteur);
    }, DELAI_LOT);
    planifier();
  }

  function viderEtat(etat) {
    clearInterval(etat.minuteur);
    etat.decodes.forEach(function (bm) { if (bm && bm.close) bm.close(); });
    etat.decodes.clear();
    etat.donnees = [];
  }

  function prioriser(i) {                        // l'image demandée passe devant
    if (!E) return;
    var u = uniteDe(i);
    if (E.uStatut[u] !== 0) return;
    var k = E.prio.indexOf(u);
    if (k > 0) E.prio.splice(k, 1);
    if (k !== 0) E.prio.unshift(u);
    if (E.prio.length > 6) E.prio.length = 6;
    pomper();
  }

  function pomper() {
    var etat = E;
    if (!etat) return;
    var max = etat.man ? 2 : (etat.jeu === "mobile" ? 4 : 6);
    while (etat.enVol < max && (etat.prio.length || (etat.libres > 0 && etat.file.length))) {
      var u;
      if (etat.prio.length) u = etat.prio.shift();
      else { u = etat.file.shift(); etat.libres--; }
      if (etat.uStatut[u] !== 0) continue;
      charger(etat, u);
    }
  }

  function charger(etat, u) {
    etat.uStatut[u] = 1;
    etat.enVol++;
    var images = imagesDe(u);
    images.forEach(function (i) { etat.statut[i] = 1; });
    var termine = function (ok, donnees) {
      etat.enVol--;
      if (etat !== E) return;
      if (ok) {
        etat.uStatut[u] = 2;
        images.forEach(function (i, k) { etat.donnees[i] = donnees[k]; etat.statut[i] = 2; });
        STATS.charges += images.length;
        planifier();
      } else {                                   // nouvel essai un peu plus tard
        etat.uStatut[u] = 0;
        images.forEach(function (i) { etat.statut[i] = 0; });
        setTimeout(function () { if (etat === E) { etat.file.unshift(u); etat.libres++; pomper(); } }, 1500);
      }
      pomper();
    };
    if (etat.man) {
      var f = etat.man.fichiers[u];
      fetch(JEUX[etat.jeu] + f.f).then(function (r) {
        if (!r.ok) throw new Error(r.status);
        return r.blob();
      }).then(function (b) {
        var pos = 0;
        termine(true, f.t.map(function (t) { var x = b.slice(pos, pos + t, "image/webp"); pos += t; return x; }));
      }, function () { termine(false); });
    } else if (VIA === "img") {
      var img = new Image();
      img.decoding = "async";
      img.onload = function () { termine(true, [img]); };
      img.onerror = function () { termine(false); };
      img.src = url(etat.jeu, u);
    } else {
      fetch(url(etat.jeu, u)).then(function (r) {
        if (!r.ok) throw new Error(r.status);
        return r.blob();
      }).then(function (b) { termine(true, [b]); }, function () { termine(false); });
    }
  }

  /* ---- Décodage à l'avance : mémoire symétrique ------------------------------ */
  var dernierScroll = 0, minuteurCalme = 0;
  function calme() { return performance.now() - dernierScroll > 140; }

  // Nombre d'images décodées gardées en mémoire (~360 Mo sur ordinateur, ~160 Mo sur mobile)
  function budget(etat) {
    if (!etat.octets) return 24;
    var mo = etat.jeu === "mobile" ? 160 : 360;
    return Math.max(24, Math.min(110, Math.floor(mo * 1048576 / etat.octets)));
  }

  // Images voulues, par ordre d'urgence :
  // 1) la CIBLE (là où le défilement s'est arrêté) : l'image se pose tout de suite au bon endroit ;
  // 2) l'intervalle entre l'image affichée et la cible, rempli par subdivisions (milieu, quarts…) :
  //    après un geste rapide, le rattrapage est immédiat au lieu d'un « ralenti » image par image ;
  // 3) au-delà de la cible dans le sens du défilement, entrecoupé (2 pour 1) d'images derrière,
  //    pour qu'un retour en arrière soit instantané.
  function voulues(n) {
    var o = [], vu = new Uint8Array(FRAME_COUNT);
    function ajoute(i) { if (i >= 0 && i < FRAME_COUNT && !vu[i]) { vu[i] = 1; o.push(i); } }
    var a = indexDessine < 0 ? indexScroll : indexCible, c = indexScroll;
    ajoute(c);
    if (a !== c) {
      var lo = Math.min(a, c), hi = Math.max(a, c), segs = [[lo, hi]];
      while (segs.length) {                       // subdivision en largeur : milieu, puis quarts…
        var suivants = [];
        for (var s2 = 0; s2 < segs.length; s2++) {
          var x = segs[s2][0], y = segs[s2][1];
          if (y - x < 2) continue;
          var m = (x + y) >> 1;
          ajoute(m); suivants.push([x, m], [m, y]);
        }
        segs = suivants;
      }
      ajoute(a);
    }
    var bas = Math.min(a, c), haut = Math.max(a, c), av = 1, ar = 1;
    while (o.length < n && (haut + av < FRAME_COUNT || bas - av >= 0 || haut + ar < FRAME_COUNT || bas - ar >= 0)) {
      if (sens > 0) { ajoute(haut + av); ajoute(haut + av + 1); av += 2; ajoute(bas - ar); ar++; }
      else { ajoute(bas - av); ajoute(bas - av - 1); av += 2; ajoute(haut + ar); ar++; }
    }
    if (o.length > n) o.length = n;
    return o;
  }

  function planifier() {
    var etat = E;
    if (!etat) return;
    var n = budget(etat), liste = voulues(n), garde = new Uint8Array(FRAME_COUNT), k;
    for (k = 0; k < liste.length; k++) garde[liste[k]] = 1;
    // 1) mémoire pleine : on libère les images non voulues, les plus éloignées d'abord
    if (etat.decodes.size > n) {
      var hors = [];
      etat.decodes.forEach(function (_, i) { if (!garde[i] && i !== indexDessine) hors.push(i); });
      hors.sort(function (x, y) { return Math.abs(y - indexScroll) - Math.abs(x - indexScroll); });
      for (k = 0; k < hors.length && etat.decodes.size > n; k++) {
        var bm = etat.decodes.get(hors[k]);
        if (bm && bm.close) bm.close();
        etat.decodes.delete(hors[k]);
      }
    }
    STATS.memoire = etat.decodes.size;
    // 2) on lance les décodages dans l'ordre d'urgence
    var max = VIA === "img" ? 3 : Math.max(2, workers.length * 2);
    for (k = 0; k < liste.length && etat.enDecodage.size < max; k++) {
      var i = liste[k];
      if (etat.decodes.has(i) || etat.enDecodage.has(i)) continue;
      if (etat.statut[i] !== 2) { if (k < 8 && calme()) prioriser(i); continue; }
      decoder(etat, i);
    }
  }

  function decoder(etat, i) {
    etat.enDecodage.add(i);
    if (VIA === "img") {
      var img = etat.donnees[i];
      if (!(img instanceof HTMLImageElement)) {   // octets (mode paquets) → <img> à partir du blob
        var el = new Image(); el.src = URL.createObjectURL(img); etat.donnees[i] = img = el;
      }
      (img.decode ? img.decode() : Promise.resolve()).then(function () { recu(etat, i, img); },
        function () { recu(etat, i, img); });
    } else {
      var w = workers[0];                         // le worker le moins chargé
      for (var k = 1; k < workers.length; k++) if (workers[k].charge < w.charge) w = workers[k];
      w.charge++;
      etat.travail = etat.travail || {};
      etat.travail[i] = w;
      w.postMessage({ i: i, gen: etat.gen, blob: etat.donnees[i], via: VIA });
    }
  }

  function surDecode(e) {
    var m = e.data;
    this.charge = Math.max(0, this.charge - 1);
    if (!E || m.gen !== E.gen) { if (m.bm && m.bm.close) m.bm.close(); return; }
    if (!m.ok) {                                  // échec de décodage → méthode suivante
      E.enDecodage.delete(m.i);
      if (VIA === "idec") { VIA = "blob"; STATS.via = VIA; planifier(); }
      else basculerSecours();
      return;
    }
    recu(E, m.i, m.bm);
  }

  function recu(etat, i, image) {
    etat.enDecodage.delete(i);
    if (etat !== E) { if (image && image.close) image.close(); return; }
    if (!etat.octets) etat.octets = (image.width || image.naturalWidth) * (image.height || image.naturalHeight) * 4;
    var ancienne = etat.decodes.get(i);
    if (ancienne && ancienne !== image && ancienne.close) ancienne.close();
    etat.decodes.set(i, image);
    STATS.decodes++;
    dessiner(false);
    planifier();
  }

  /* ---- Dessin -------------------------------------------------------------
     « Cover » centré, pixel pour pixel : le canvas prend la taille ENTIÈRE de la
     partie visible de l'image source (jamais plus que l'écran × DPR ≤ 2).
     - Cas courant (l'image doit être agrandie) : copie 1:1, en pixels entiers,
       sans aucun rééchantillonnage ; l'agrandissement à l'écran est fait par la
       carte graphique (canvas étiré en CSS, même proportion).
     - Petite fenêtre (l'image doit être réduite) : canvas = écran × DPR,
       réduction en qualité "high".                                              */
  var largeurCanvas = 0, hauteurCanvas = 0, srcW = 0, srcH = 0;
  var cadre = { sx: 0, sy: 0, sw: 0, sh: 0 };

  function dimensionner(forcer) {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = scene.clientWidth, h = scene.clientHeight;
    if (!w || !h) return;
    var cw, ch;
    if (srcW && srcH) {
      var s = Math.max(w / srcW, h / srcH);
      var sw = Math.min(srcW, Math.round(w / s)), sh = Math.min(srcH, Math.round(h / s));
      cadre.sw = sw; cadre.sh = sh;
      cadre.sx = Math.floor((srcW - sw) / 2); cadre.sy = Math.floor((srcH - sh) / 2);
      if (s * dpr >= 1) { cw = sw; ch = sh; }
      else { cw = Math.round(w * dpr); ch = Math.round(h * dpr); }
    } else { cw = Math.round(w * dpr); ch = Math.round(h * dpr); }
    if (cw === largeurCanvas && ch === hauteurCanvas && !forcer) return;
    largeurCanvas = canvas.width = cw;
    hauteurCanvas = canvas.height = ch;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    dessiner(true);
  }

  // Image à afficher : l'exacte si elle est prête ; sinon la meilleure ENTRE l'image
  // actuelle et la cible (jamais dans l'autre sens) ; sinon on garde l'image actuelle.
  function choisir() {
    var dec = E.decodes, c = indexCible;
    if (dec.has(c)) return c;
    if (indexDessine < 0 || !dec.has(indexDessine)) {   // rien d'affiché : la plus proche
      var meilleur = -1, ecart = 1e9;
      dec.forEach(function (_, k) { var d = Math.abs(k - c); if (d < ecart) { ecart = d; meilleur = k; } });
      return meilleur;
    }
    if (c === indexDessine) return c;
    var p = c > indexDessine ? 1 : -1;
    // garde-fou : jamais à l'opposé de la position de défilement réelle
    if (indexScroll !== indexDessine && (indexScroll > indexDessine ? 1 : -1) !== p) return indexDessine;
    for (var i = c - p; i !== indexDessine; i -= p) if (dec.has(i)) return i;
    return indexDessine;
  }

  function dessiner(forcer) {
    if (!E) return;
    var i = choisir();
    if (i < 0) return;
    if (i === indexDessine && !forcer) return;  // on ne redessine que si l'image change
    var image = E.decodes.get(i);
    if (!image) return;
    var iw = image.width || image.naturalWidth, ih = image.height || image.naturalHeight;
    if (iw !== srcW || ih !== srcH) { srcW = iw; srcH = ih; largeurCanvas = 0; indexDessine = -1; dimensionner(true); return; }
    var t0 = performance.now();
    ctx.drawImage(image, cadre.sx, cadre.sy, cadre.sw, cadre.sh, 0, 0, largeurCanvas, hauteurCanvas);
    var td = performance.now() - t0;
    if (td > STATS.dessinMax) STATS.dessinMax = td;
    if (i !== indexDessine) {
      indexDessine = i; STATS.affiche = i;
      STATS.dessins++;
      if (i === indexCible) STATS.exacts++; else STATS.approches++;
    }
    if (!racine.classList.contains("pret")) racine.classList.add("pret");
  }

  /* ---- Défilement --------------------------------------------------------- */
  var debutVisible = true, finVisible = false, surHeros = null, tickPrevu = false;

  // Progrès calculé sur la hauteur FIXE de la scène (100svh) et non sur window.innerHeight : sur
  // téléphone, la barre d'adresse qui se replie change innerHeight et ferait « sauter » la vidéo.
  var hauteurScene = 0;
  function progression() {
    var r = racine.getBoundingClientRect();
    if (!hauteurScene) hauteurScene = scene.offsetHeight || window.innerHeight;
    var total = r.height - hauteurScene;
    return total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
  }

  function surcouches(p) {
    var r = racine.getBoundingClientRect(), dedans = r.bottom > 0 && r.top < window.innerHeight;
    if (dedans !== surHeros) { surHeros = dedans; document.body.classList.toggle("sur-heros", dedans); }
    var d = p < 0.04, f = p > 0.93;
    if (d !== debutVisible) { debutVisible = d; debut.classList.toggle("cache", !d); }
    if (f !== finVisible) {
      finVisible = f;
      fin.classList.toggle("visible", f);
      fin.setAttribute("aria-hidden", String(!f));
      fin.querySelectorAll("a, button, input").forEach(function (el) { el.tabIndex = f ? 0 : -1; });
    }
  }

  // Lissage amorti : l'affichage rejoint la position de défilement en jouant TOUTES les images
  // intermédiaires (une molette avance par crans de ~100 px ≈ 6 images : sans lissage, ça saute).
  var LISSAGE_MS = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 85;
  var tPrec = 0;

  function tick(t) {
    tickPrevu = false;
    var p = progression();
    surcouches(p);
    var nouveau = Math.round(p * (FRAME_COUNT - 1));
    if (nouveau !== indexScroll) {
      sens = nouveau > indexScroll ? 1 : -1;
      indexScroll = nouveau; STATS.cible = nouveau;
      planifier();
    }
    var dt = tPrec ? Math.min(100, t - tPrec) : 16.7;
    tPrec = t;
    var ecart = indexScroll - position;
    if (!LISSAGE_MS || Math.abs(ecart) > 90) position = indexScroll;        // saut lointain : direct
    else {
      position += ecart * (1 - Math.exp(-dt / LISSAGE_MS));
      if (Math.abs(indexScroll - position) < 0.35) position = indexScroll;
    }
    var idx = Math.round(position);
    if (idx !== indexCible) { indexCible = idx; dessiner(false); if (indexDessine !== indexCible) planifier(); }
    else if (indexDessine !== indexCible) dessiner(false);                  // image arrivée entre-temps
    if (position !== indexScroll || indexDessine !== indexCible) demanderTick(); else tPrec = 0;
  }
  function demanderTick() { if (!tickPrevu) { tickPrevu = true; requestAnimationFrame(tick); } }

  window.addEventListener("scroll", function () {
    dernierScroll = performance.now();
    clearTimeout(minuteurCalme);
    minuteurCalme = setTimeout(planifier, 160);   // à l'arrêt : l'image exacte en priorité
    demanderTick();
  }, { passive: true });

  var redim = false;
  window.addEventListener("resize", function () {
    if (redim) return;
    redim = true;
    requestAnimationFrame(function () {
      redim = false;
      hauteurScene = scene.offsetHeight || window.innerHeight;
      dimensionner(false);
      if (E && E.jeu !== categorie()) demarrer(true);   // changement ordinateur ↔ mobile
      demanderTick();
    });
  }, { passive: true });
  window.addEventListener("pageshow", function () { dimensionner(true); demanderTick(); });

  /* ---- Démarrage ------------------------------------------------------------ */
  fin.querySelectorAll("a, button, input").forEach(function (el) { el.tabIndex = -1; });
  indexScroll = position = indexCible = Math.round(progression() * (FRAME_COUNT - 1));
  STATS.cible = indexScroll;
  surcouches(progression());
  dimensionner(true);
  demarrer(false);
})();
