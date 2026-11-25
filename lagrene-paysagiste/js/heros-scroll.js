/* ==========================================================================
   Lagrene Paysagiste 59 — héros scroll : la vidéo « Votre jardin se
   transforme » avance image par image au rythme du défilement.
   --------------------------------------------------------------------------
   Architecture
   - Conteneur .heros-scroll de 320vh ; à l'intérieur, .hs-scene collante
     (top 0, 100svh) qui contient le <canvas> plein écran.
   - 297 images. Progrès = défilement du conteneur (0 → 1), index =
     round(progrès × 296). On ne redessine QUE si l'index change.
   - Dessin en « cover » manuel, imageSmoothingQuality "high", DPR ≤ 2.
   - Jeu mobile si largeur < 1024 px ; changement de catégorie au
     redimensionnement → on vide tout et on recharge le bon jeu.
   - Chargement : image 1 en priorité absolue (dessinée dès son arrivée),
     puis lots de 24 images toutes les 120 ms ; une image demandée par le
     défilement et pas encore chargée passe devant tout le monde.
   Fluidité
   - Chargement (octets) et décodage sont séparés : les images proches de la
     position courante sont décodées À L'AVANCE dans des workers (hors du fil
     principal), dans le sens du défilement. Au moment de dessiner, l'image
     est déjà prête : drawImage est instantané, aucune saccade.
   - Une fenêtre limitée d'images décodées est gardée en mémoire (les plus
     éloignées sont libérées) ; si l'image exacte n'est pas encore prête, on
     affiche la plus proche, jamais un écran vide.
   - Défilement : écouteur passif + requestAnimationFrame, aucun calcul lourd.
   - Ouvert depuis un dossier (file://) : mode de secours <img> + decode().
   ========================================================================== */
(function () {
  "use strict";

  var racine = document.querySelector(".heros-scroll");
  if (!racine) return;

  var FRAME_COUNT = 297;
  var LOT = 24, DELAI_LOT = 120;              // préchargement : 24 images / 120 ms
  var EN_VOL_MAX = 6;                          // requêtes réseau simultanées (4 sur mobile)
  var JEUX = { ordi: "images/hero-frames/", mobile: "images/hero-frames-sm/" };

  var scene = racine.querySelector(".hs-scene");
  var canvas = racine.querySelector("canvas");
  var ctx = canvas.getContext("2d", { alpha: false });
  var debut = racine.querySelector(".hs-debut");
  var fin = racine.querySelector(".hs-fin");

  var parFichier = location.protocol === "file:";
  var GECKO = /firefox/i.test(navigator.userAgent);
  var peutWorker = !parFichier && typeof Worker === "function" && typeof createImageBitmap === "function" && typeof fetch === "function";
  // Méthode de décodage : workers (blob / ImageDecoder) ou secours <img>.decode()
  var VIA = !peutWorker ? "img" : (GECKO ? (typeof ImageDecoder === "function" ? "idec" : "img") : "blob");

  // Jeu « mobile » sous 1024 px de large ; un téléphone tenu à l'horizontale garde le jeu paysage
  function categorie() {
    var w = window.innerWidth, h = window.innerHeight;
    return w < 1024 && h >= w * 0.8 ? "mobile" : "ordi";
  }
  function url(jeu, i) { return JEUX[jeu] + String(i + 1).padStart(4, "0") + ".webp"; }

  // Mode « paquets » (attribut data-paquets) : images regroupées par lots de 24 dans des fichiers
  // .bin (index dans paquets.json). Sert quand l'hébergement limite le nombre de fichiers.
  var MODE_PAQUETS = racine.hasAttribute("data-paquets") && !parFichier;
  var manifestes = {};

  /* ---- Workers de décodage ------------------------------------------------ */
  var workers = [], prochainWorker = 0;
  function creerWorkers() {
    if (VIA === "img" || workers.length) return;
    var n = Math.max(1, Math.min(3, (navigator.hardwareConcurrency || 4) - 1));
    try {
      for (var k = 0; k < n; k++) {
        var w = new Worker("js/heros-scroll-worker.js");
        w.onmessage = surDecode;
        w.onerror = function () { basculerSecours(); };
        workers.push(w);
      }
    } catch (e) { basculerSecours(); }
  }
  function basculerSecours() {            // si les workers échouent : mode <img>
    if (VIA === "img") return;
    VIA = "img";
    workers.forEach(function (w) { w.terminate(); });
    workers = [];
    demarrer(true);
  }

  /* ---- État du jeu d'images courant -------------------------------------- */
  var E = null;
  var gen = 0;
  var indexCible = 0, indexDessine = -1, sens = 1;
  var STATS = window.__herosStats = { charges: 0, decodes: 0, dessins: 0, exacts: 0, approches: 0, via: VIA, paquets: MODE_PAQUETS, dessinMax: 0 };

  // Ordre de chargement ENTRELACÉ : image 1, puis 1 image sur 16 sur toute la vidéo, puis 1 sur 8,
  // 1 sur 4, 1 sur 2, et le reste. En moins de deux secondes toute la vidéo est couverte : où que
  // le visiteur défile, une image proche est prête — l'animation ne se fige jamais pendant le
  // chargement, elle s'affine.
  function ordreEntrelace() {
    var vu = new Uint8Array(FRAME_COUNT), o = [0]; vu[0] = 1;
    [16, 8, 4, 2, 1].forEach(function (pas) {
      for (var i = 0; i < FRAME_COUNT; i += pas) if (!vu[i]) { vu[i] = 1; o.push(i); }
    });
    if (!vu[FRAME_COUNT - 1]) o.push(FRAME_COUNT - 1);
    return o;
  }
  var ORDRE = ordreEntrelace();

  // Unité de chargement : une image (mode normal) ou un paquet (mode paquets, liste d'images
  // donnée par paquets.json — mêmes lots entrelacés de 24).
  function uniteDe(i) { return E.man ? E.uniteDe[i] : i; }
  function imagesDe(u) { return E.man ? E.man.fichiers[u].i : [u]; }

  // statut d'image : 0 rien, 1 en cours, 2 chargée — statut d'unité : idem
  function nouvelEtat(jeu, man) {
    var nbU = man ? man.fichiers.length : FRAME_COUNT, uDe = null;
    if (man) { uDe = new Int16Array(FRAME_COUNT); man.fichiers.forEach(function (f, u) { f.i.forEach(function (i) { uDe[i] = u; }); }); }
    return { jeu: jeu, gen: ++gen, man: man, uniteDe: uDe, donnees: new Array(FRAME_COUNT), statut: new Uint8Array(FRAME_COUNT),
             uStatut: new Uint8Array(nbU), nbU: nbU, decodes: new Map(), enDecodage: new Set(), file: [], prio: [],
             enVol: 0, libres: 0, minuteur: 0, fenetreAvant: 16, fenetreArriere: 8, octetsImage: 0 };
  }

  /* ---- Chargement des octets (réseau) ------------------------------------- */
  function demarrer(forcer) {
    var jeu = categorie();
    if (E && E.jeu === jeu && !forcer) return;
    if (E) viderEtat(E);
    E = null;
    creerWorkers();
    STATS.via = VIA;
    indexDessine = -1;
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
    // image 1 en priorité absolue, puis le reste dans l'ordre entrelacé
    etat.prio.push(uniteDe(0));
    if (etat.man) { for (var u = 0; u < etat.nbU; u++) if (u !== uniteDe(0)) etat.file.push(u); }
    else ORDRE.forEach(function (i) { if (i !== 0) etat.file.push(i); });
    pomper();
    // lots de 24 images toutes les 120 ms (en mode paquets : un paquet = un lot)
    etat.minuteur = setInterval(function () {
      if (etat !== E) return clearInterval(etat.minuteur);
      etat.libres += etat.man ? 1 : LOT;
      pomper();
      if (!etat.file.length) clearInterval(etat.minuteur);
    }, DELAI_LOT);
    planifierDecodage();                         // le défilement a peut-être déjà demandé une image
  }

  function viderEtat(etat) {
    clearInterval(etat.minuteur);
    etat.decodes.forEach(function (bm) { if (bm && bm.close) bm.close(); });
    etat.decodes.clear();
    etat.donnees = [];
  }

  function prioriser(i) {                        // une image demandée par le défilement passe devant
    if (!E) return;
    var u = uniteDe(i);
    if (E.uStatut[u] !== 0) return;
    var k = E.prio.indexOf(u);
    if (k > 0) E.prio.splice(k, 1);
    if (k !== 0) E.prio.unshift(u);
    if (E.prio.length > 6) E.prio.length = 6;     // les demandes dépassées retournent dans la file normale
    pomper();
  }

  function pomper() {
    var etat = E;
    if (!etat) return;
    var max = etat.man ? 2 : (etat.jeu === "mobile" ? 4 : EN_VOL_MAX);
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
        planifierDecodage();
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

  /* ---- Décodage à l'avance, dans le sens du défilement -------------------- */
  function ajusterFenetre(largeur, hauteur) {
    // ~250 Mo d'images décodées au maximum sur ordinateur, ~110 Mo sur mobile
    var budget = (E.jeu === "mobile" ? 110 : 250) * 1024 * 1024;
    var n = Math.max(8, Math.min(40, Math.floor(budget / (largeur * hauteur * 4))));
    E.fenetreAvant = Math.round(n * 0.65);
    E.fenetreArriere = n - E.fenetreAvant;
    E.octetsImage = largeur * hauteur * 4;
  }

  // Pendant un défilement rapide, l'image exacte arriverait trop tard : on laisse la file entrelacée
  // couvrir la vidéo. Dès que le visiteur ralentit ou s'arrête, l'image exacte passe en priorité.
  var dernierScroll = 0, minuteurCalme = 0;
  function calme() { return performance.now() - dernierScroll > 140; }

  function planifierDecodage() {
    var etat = E;
    if (!etat) return;
    var c = indexCible;
    var av = sens >= 0 ? etat.fenetreAvant : etat.fenetreArriere;
    var ar = sens >= 0 ? etat.fenetreArriere : etat.fenetreAvant;
    var lo = Math.max(0, c - ar), hi = Math.min(FRAME_COUNT - 1, c + av);
    // 1) on libère les images décodées hors de la fenêtre (sauf la première, toujours prête)
    etat.decodes.forEach(function (bm, i) {
      if ((i < lo - 2 || i > hi + 2) && i !== 0) {
        if (bm && bm.close) bm.close();
        etat.decodes.delete(i);
      }
    });
    // 2) on demande les décodages : la cible d'abord, puis vers l'avant, puis l'arrière
    var maxDecodage = VIA === "img" ? 4 : Math.max(2, workers.length * 2);
    var ordre = [c], d = sens >= 0 ? 1 : -1;
    for (var k = 1; k <= Math.max(av, ar); k++) {
      if (k <= av) ordre.push(c + k * d);
      if (k <= ar) ordre.push(c - k * d);
    }
    for (var n = 0; n < ordre.length; n++) {
      var i = ordre[n];
      if (i < 0 || i >= FRAME_COUNT) continue;
      if (etat.statut[i] === 0) { if (n < 6 && calme()) prioriser(i); continue; }
      if (etat.statut[i] !== 2 || etat.decodes.has(i) || etat.enDecodage.has(i)) continue;
      if (etat.enDecodage.size >= maxDecodage) break;
      decoder(etat, i);
    }
    if (!etat.decodes.has(0) && etat.statut[0] === 2 && !etat.enDecodage.has(0)) decoder(etat, 0);
  }

  function decoder(etat, i) {
    etat.enDecodage.add(i);
    if (VIA === "img") {
      var img = etat.donnees[i];
      if (!(img instanceof HTMLImageElement)) {   // octets (mode paquets) → <img> à partir du blob
        var el = new Image(); el.src = URL.createObjectURL(img); etat.donnees[i] = img = el;
      }
      (img.decode ? img.decode() : Promise.resolve()).then(function () {
        recu(etat, i, img);
      }, function () { recu(etat, i, img); });
    } else {
      var w = workers[prochainWorker++ % workers.length];
      w.postMessage({ i: i, gen: etat.gen, blob: etat.donnees[i], via: VIA });
    }
  }

  function surDecode(e) {
    var m = e.data;
    if (!E || m.gen !== E.gen) { if (m.bm && m.bm.close) m.bm.close(); return; }
    if (!m.ok) {                                 // échec de décodage → mode de secours
      E.enDecodage.delete(m.i);
      if (VIA === "idec") { VIA = "blob"; STATS.via = VIA; planifierDecodage(); }
      else basculerSecours();
      return;
    }
    recu(E, m.i, m.bm);
  }

  function recu(etat, i, image) {
    etat.enDecodage.delete(i);
    if (etat !== E) { if (image && image.close) image.close(); return; }
    if (!etat.octetsImage) ajusterFenetre(image.width || image.naturalWidth, image.height || image.naturalHeight);
    etat.decodes.set(i, image);
    STATS.decodes++;
    // dessine si c'est l'image attendue, ou si elle est plus proche que celle affichée
    if (i === indexCible || indexDessine < 0 || Math.abs(i - indexCible) < Math.abs(indexDessine - indexCible)) dessiner();
    planifierDecodage();
  }

  /* ---- Dessin -------------------------------------------------------------
     « Cover » centré, pixel pour pixel : le canvas prend la taille de la PARTIE
     VISIBLE de l'image source (jamais plus que l'écran × DPR plafonné à 2).
     - Cas courant (l'image doit être agrandie) : copie 1:1 de la zone visible,
       aucun rééchantillonnage par image ; l'agrandissement à l'écran est fait
       par la carte graphique (canvas étiré en CSS, même proportion → aucune
       déformation).
     - Petite fenêtre (l'image doit être réduite) : canvas = écran × DPR et
       réduction en qualité "high".                                              */
  var largeurCanvas = 0, hauteurCanvas = 0, srcW = 0, srcH = 0;
  var cadre = { sx: 0, sy: 0, sw: 0, sh: 0 };
  function dimensionner() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = scene.clientWidth, h = scene.clientHeight;
    if (!w || !h) return;
    var cw, ch;
    if (srcW && srcH) {
      var s = Math.max(w / srcW, h / srcH);           // échelle « cover » (px CSS par px source)
      cadre.sw = Math.min(srcW, w / s); cadre.sh = Math.min(srcH, h / s);
      cadre.sx = (srcW - cadre.sw) / 2; cadre.sy = (srcH - cadre.sh) / 2;
      if (s * dpr >= 1) { cw = Math.round(cadre.sw); ch = Math.round(cadre.sh); }   // copie 1:1
      else { cw = Math.round(w * dpr); ch = Math.round(h * dpr); }                 // réduction
    } else { cw = Math.round(w * dpr); ch = Math.round(h * dpr); }
    if (cw === largeurCanvas && ch === hauteurCanvas) return;
    largeurCanvas = canvas.width = cw;
    hauteurCanvas = canvas.height = ch;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    indexDessine = -1;
    dessiner();
  }

  function dessiner() {
    if (!E) return;
    var i = indexCible, image = E.decodes.get(i);
    if (!image) {                                // pas encore prête : la plus proche déjà décodée
      var meilleur = -1, ecart = 1e9;
      E.decodes.forEach(function (_, k) { var d = Math.abs(k - indexCible); if (d < ecart) { ecart = d; meilleur = k; } });
      if (meilleur < 0) return;
      i = meilleur; image = E.decodes.get(i);
    }
    if (i === indexDessine) return;              // on ne redessine que si l'image change
    var iw = image.width || image.naturalWidth, ih = image.height || image.naturalHeight;
    if (iw !== srcW || ih !== srcH) { srcW = iw; srcH = ih; largeurCanvas = 0; dimensionner(); return; }
    var t0 = performance.now();
    ctx.drawImage(image, cadre.sx, cadre.sy, cadre.sw, cadre.sh, 0, 0, largeurCanvas, hauteurCanvas);
    var td = performance.now() - t0;
    if (td > STATS.dessinMax) STATS.dessinMax = td;
    indexDessine = i;
    STATS.dessins++;
    if (i === indexCible) STATS.exacts++; else STATS.approches++;
    if (!racine.classList.contains("pret")) racine.classList.add("pret");
  }

  /* ---- Défilement --------------------------------------------------------- */
  var debutVisible = true, finVisible = false, tickPrevu = false;

  function progression() {
    var r = racine.getBoundingClientRect();
    var total = r.height - window.innerHeight;
    return total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
  }

  var surHeros = null;
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

  // Lissage amorti : l'affichage rejoint la position du défilement en jouant TOUTES les images
  // intermédiaires (une molette avance par crans de ~100 px ≈ 6 images : sans lissage, ça saute).
  var LISSAGE_MS = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 85;
  var position = 0, indexScroll = 0, tPrec = 0;

  function tick(t) {
    tickPrevu = false;
    var p = progression();
    surcouches(p);
    indexScroll = Math.round(p * (FRAME_COUNT - 1));
    var dt = tPrec ? Math.min(100, t - tPrec) : 16.7;
    tPrec = t;
    var ecart = indexScroll - position;
    if (!LISSAGE_MS || Math.abs(ecart) > 90) position = indexScroll;          // saut lointain : direct
    else {
      position += ecart * (1 - Math.exp(-dt / LISSAGE_MS));
      if (Math.abs(indexScroll - position) < 0.35) position = indexScroll;
    }
    var idx = Math.round(position);
    if (idx !== indexCible) {                     // on ne redessine que si l'image change
      sens = idx > indexCible ? 1 : -1;
      indexCible = idx;
      dessiner();
      planifierDecodage();
    }
    if (position !== indexScroll) demanderTick(); else tPrec = 0;
  }
  function demanderTick() { if (!tickPrevu) { tickPrevu = true; requestAnimationFrame(tick); } }

  window.addEventListener("scroll", function () {
    dernierScroll = performance.now();
    clearTimeout(minuteurCalme);
    minuteurCalme = setTimeout(planifierDecodage, 160);    // à l'arrêt : l'image exacte en priorité
    demanderTick();
  }, { passive: true });
  var redim = false;
  window.addEventListener("resize", function () {
    if (redim) return;
    redim = true;
    requestAnimationFrame(function () {
      redim = false;
      dimensionner();
      if (E && E.jeu !== categorie()) demarrer(true);   // changement ordinateur ↔ mobile
      demanderTick();
    });
  }, { passive: true });
  window.addEventListener("pageshow", function () { indexDessine = -1; dessiner(); demanderTick(); });

  /* ---- Démarrage ------------------------------------------------------------ */
  fin.querySelectorAll("a, button, input").forEach(function (el) { el.tabIndex = -1; });
  dimensionner();
  demarrer(false);
  indexCible = indexScroll = position = Math.round(progression() * (FRAME_COUNT - 1));
  surcouches(progression());
})();
