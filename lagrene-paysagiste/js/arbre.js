/* ==========================================================================
   Lagrene Paysagiste 59 — arbre génératif (section « Zones d'intervention »)
   --------------------------------------------------------------------------
   Recréation native du composant « GenerativeTree » (dont le fichier source de
   l'animation n'était pas fourni) : un arbre pousse branche par branche depuis
   le sol, se tient, s'efface, puis un nouvel arbre (toujours différent)
   repousse. Des particules de pollen flottent autour ; le survol de la souris
   (ou le doigt) fait frémir l'arbre.

   Réglages (attributs data- sur l'élément [data-arbre], mêmes noms et bornes
   que le composant) : speed 0–3, size 0.65–1.5, particles 0–2, opacity.
   Performance :
   - les branches sont dessinées UNE fois, au fur et à mesure de leur pousse,
     dans une image tampon ; chaque image d'animation ne fait que recopier ce
     tampon et dessiner ~50 particules ;
   - l'animation s'arrête complètement quand la section n'est pas à
     l'écran ou que l'onglet est caché ;
   - « réduire les animations » : un arbre complet, immobile.
   ========================================================================== */
(function () {
  "use strict";
  var hote = document.querySelector("[data-arbre]");
  if (!hote) return;
  var canvas = hote.querySelector("canvas");
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext("2d");

  function borne(v, a, b) { return Math.min(b, Math.max(a, v)); }
  var d = hote.dataset;
  var SPEED = borne(d.speed != null ? +d.speed : 1, 0, 3);
  var SIZE = borne(d.size != null ? +d.size : 1, 0.65, 1.5);
  var PARTICULES = borne(d.particles != null ? +d.particles : 1, 0, 2);
  var OPACITE = borne(d.opacity != null ? +d.opacity : 1, 0.05, 1);
  var REDUIT = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Durées (secondes, à vitesse 1)
  var TENUE = 14, FONDU = 2.4, ATTENTE = 0.9;

  // Couleurs (fond sable clair) : écorce bois foncé, rameaux vert olive, feuillage olive à vert tendre
  var ECORCE = [88, 76, 52], RAMEAU = [102, 115, 63];
  var FEUILLES = ["102,115,63", "128,145,70", "157,182,84", "181,221,115", "255,255,255"];

  var tampon = document.createElement("canvas"), tctx = tampon.getContext("2d");
  var W = 0, H = 0, dpr = 1, largeurVue = 0;
  var actives = [], profondeurMax = 8, base = { x: 0, y: 0 };
  var phase = "pousse", tPhase = 0, alpha = 1, frisson = 0, temps = 0;
  var particules = [];
  var hasard = Math.random;

  function rnd(a, b) { return a + hasard() * (b - a); }
  function mix(c1, c2, t) {
    return "rgb(" + Math.round(c1[0] + (c2[0] - c1[0]) * t) + "," + Math.round(c1[1] + (c2[1] - c1[1]) * t) + "," + Math.round(c1[2] + (c2[2] - c1[2]) * t) + ")";
  }

  /* ---- Génération d'un arbre ---------------------------------------------- */
  function branche(x, y, angle, longueur, epaisseur, profondeur) {
    var b = {
      x0: x, y0: y, a: angle, l: longueur, w: epaisseur, prof: profondeur, p: 0,
      x1: x + Math.cos(angle) * longueur, y1: y + Math.sin(angle) * longueur,
      duree: rnd(0.34, 0.52) * (profondeur === 0 ? 1.6 : 1), enfants: [], feuille: false
    };
    if (profondeur < profondeurMax && longueur > 3.2) {
      var n = profondeur === 0 ? 2 : (hasard() < 0.34 ? 3 : 2);
      var ouverture = rnd(0.5, 0.78);
      for (var k = 0; k < n; k++) {
        var decalage = (k - (n - 1) / 2) * ouverture * (n === 3 ? 0.85 : 1.05);
        var a2 = angle + decalage + rnd(-0.14, 0.14);
        a2 += (-Math.PI / 2 - a2) * 0.045;                // les branches cherchent la lumière
        b.enfants.push(branche(b.x1, b.y1, a2, longueur * rnd(0.68, 0.8), epaisseur * 0.7, profondeur + 1));
      }
    } else b.feuille = true;
    return b;
  }

  function nouvelArbre() {
    tctx.setTransform(1, 0, 0, 1, 0, 0);
    tctx.clearRect(0, 0, tampon.width, tampon.height);
    tctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    tctx.lineCap = "round";
    profondeurMax = W < 560 ? 8 : 9;
    var hauteurUtile = Math.min(H * 0.96, W * 0.9);
    var tronc = hauteurUtile * 0.255 * SIZE;
    base = { x: W / 2 + rnd(-W * 0.04, W * 0.04), y: H + 2 };
    var racine = branche(base.x, base.y, -Math.PI / 2 + rnd(-0.06, 0.06), tronc, Math.max(3, tronc * 0.11), 0);
    actives = [racine];
    phase = "pousse"; tPhase = 0; alpha = 1;
  }

  /* ---- Pousse : seul le morceau qui vient de pousser est dessiné ------------ */
  function pousser(dt) {
    var suivantes = [];
    for (var k = 0; k < actives.length; k++) {
      var b = actives[k], avant = b.p;
      b.p = Math.min(1, b.p + dt / b.duree);
      var xa = b.x0 + (b.x1 - b.x0) * avant, ya = b.y0 + (b.y1 - b.y0) * avant;
      var xb = b.x0 + (b.x1 - b.x0) * b.p, yb = b.y0 + (b.y1 - b.y0) * b.p;
      var t = b.prof / profondeurMax;
      tctx.strokeStyle = mix(ECORCE, RAMEAU, t * t);
      tctx.globalAlpha = 0.95 - t * 0.25;
      tctx.lineWidth = Math.max(0.6, b.w * (1 - 0.3 * b.p));
      tctx.beginPath(); tctx.moveTo(xa, ya); tctx.lineTo(xb, yb); tctx.stroke();
      if (b.p < 1) suivantes.push(b);
      else if (b.feuille) feuillage(b.x1, b.y1);
      else for (var j = 0; j < b.enfants.length; j++) suivantes.push(b.enfants[j]);
    }
    tctx.globalAlpha = 1;
    actives = suivantes;
    return actives.length > 0;
  }

  function feuillage(x, y) {
    var n = 2 + Math.floor(hasard() * 3);
    for (var k = 0; k < n; k++) {
      var c = FEUILLES[Math.floor(hasard() * FEUILLES.length)], r = rnd(1.2, 3.1);
      var fx = x + rnd(-7, 7), fy = y + rnd(-7, 5);
      tctx.fillStyle = "rgba(" + c + ",0.18)";
      tctx.beginPath(); tctx.arc(fx, fy, r * 2.3, 0, 6.2832); tctx.fill();
      tctx.fillStyle = "rgba(" + c + "," + rnd(0.6, 0.9).toFixed(2) + ")";
      tctx.beginPath(); tctx.arc(fx, fy, r, 0, 6.2832); tctx.fill();
    }
  }

  /* ---- Pollen ---------------------------------------------------------------- */
  function creerParticules() {
    var n = Math.round(50 * PARTICULES * (W < 560 ? 0.6 : 1));
    particules = [];
    for (var k = 0; k < n; k++) particules.push(nouvelleParticule(true));
  }
  function nouvelleParticule(partout) {
    return { x: rnd(0, W), y: partout ? rnd(0, H) : H + rnd(0, 20), vy: rnd(7, 20), amp: rnd(6, 18), f: rnd(0.3, 0.9),
             ph: rnd(0, 6.28), r: rnd(0.7, 1.9), a: rnd(0.25, 0.75) };
  }
  function dessinerParticules(dt) {
    ctx.globalCompositeOperation = "source-over";
    for (var k = 0; k < particules.length; k++) {
      var q = particules[k];
      q.y -= q.vy * dt * SPEED; q.ph += q.f * dt * SPEED;
      if (q.y < -10) particules[k] = q = nouvelleParticule(false);
      var x = q.x + Math.sin(q.ph) * q.amp, sc = 0.75 + 0.25 * Math.sin(q.ph * 2.3);
      ctx.fillStyle = "rgba(255,255,255," + (q.a * 0.5 * sc).toFixed(3) + ")";
      ctx.beginPath(); ctx.arc(x, q.y, q.r * 3.2, 0, 6.2832); ctx.fill();
      ctx.fillStyle = "rgba(102,115,63," + (q.a * 0.8 * sc).toFixed(3) + ")";
      ctx.beginPath(); ctx.arc(x, q.y, q.r, 0, 6.2832); ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
  }

  /* ---- Image complète ------------------------------------------------------- */
  function rendu(dt) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.globalAlpha = alpha * OPACITE;
    if (frisson > 0.002) {                       // l'arbre frémit autour de sa base
      ctx.translate(base.x, base.y);
      ctx.rotate(Math.sin(temps * 9) * frisson * 0.028);
      ctx.translate(-base.x, -base.y);
    }
    ctx.drawImage(tampon, 0, 0, W, H);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalAlpha = OPACITE;
    dessinerParticules(dt);
    ctx.globalAlpha = 1;
  }

  /* ---- Boucle ------------------------------------------------------------------ */
  var enCours = false, dernier = 0, visible = false;
  function boucle(now) {
    if (!enCours) return;
    var dt = Math.min(0.05, (now - (dernier || now)) / 1000); dernier = now;
    var v = dt * SPEED;
    temps += v; tPhase += v;
    frisson *= Math.exp(-dt * 2.4);
    if (phase === "pousse") { if (!pousser(v)) { phase = "tenue"; tPhase = 0; } }
    else if (phase === "tenue") { if (tPhase > TENUE) { phase = "fondu"; tPhase = 0; } }
    else if (phase === "fondu") { alpha = Math.max(0, 1 - tPhase / FONDU); if (alpha === 0) { phase = "attente"; tPhase = 0; } }
    else if (phase === "attente" && tPhase > ATTENTE) nouvelArbre();
    rendu(dt);
    requestAnimationFrame(boucle);
  }
  function lancer() {
    var doit = visible && !document.hidden && SPEED > 0 && !REDUIT;
    if (doit && !enCours) { enCours = true; dernier = 0; requestAnimationFrame(boucle); }
    else if (!doit) enCours = false;
  }

  /* ---- Taille ------------------------------------------------------------------- */
  function dimensionner() {
    var w = hote.clientWidth, h = hote.clientHeight;
    if (!w || !h) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    var largeurChange = Math.abs(w - largeurVue) > 1;
    W = w; H = h; largeurVue = w;
    canvas.width = tampon.width = Math.round(w * dpr);
    canvas.height = tampon.height = Math.round(h * dpr);
    if (largeurChange || !particules.length) creerParticules();
    nouvelArbre();
    if (REDUIT) { while (pousser(0.5)) {} rendu(0); }
  }

  // Le survol fait frémir l'arbre (souris ou doigt)
  var px = null;
  hote.addEventListener("pointermove", function (e) {
    if (px !== null) frisson = Math.min(1, frisson + Math.min(40, Math.abs(e.clientX - px)) * 0.012);
    px = e.clientX;
  }, { passive: true });
  hote.addEventListener("pointerleave", function () { px = null; }, { passive: true });

  if ("ResizeObserver" in window) {
    var attente = 0;
    new ResizeObserver(function () { clearTimeout(attente); attente = setTimeout(dimensionner, 120); }).observe(hote);
  } else window.addEventListener("resize", dimensionner);
  dimensionner();

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; lancer(); }, { rootMargin: "100px 0px" }).observe(hote);
  } else { visible = true; lancer(); }
  document.addEventListener("visibilitychange", lancer);
})();
