/* Ouverture « coup de vent » de la page d'accueil (~4 s).
   Sur le fond olive, un arbre pousse et le nom « Le Ch’ti Élagueur » apparaît ; puis un coup de vent
   emporte les feuilles et balaie le fond pour dévoiler la vidéo du jardin, qui recule légèrement.

   - Jouée à l'arrivée sur le site, une fois par visite (onglet) : pas quand on revient à l'accueil
     depuis une autre page. Le choix est fait dans le HTML, avant le premier affichage.
   - Un clic, une touche ou un défilement accélèrent l'animation jusqu'au coup de vent.
   - La vidéo n'est dévoilée que lorsque sa première image est prête (attente limitée à 3,5 s).
   - Tout est dessiné dans un seul canvas ; hasard reproductible (même arbre à chaque visite).
   - Fluidité : chaque feuille est un petit « lutin » dessiné une fois puis recopié (drawImage),
     les branches terminées sont tracées par niveau, et le départ attend une page calme
     et les polices (sans quoi le nom changerait de police en pleine montée). */
(function () {
  "use strict";
  var intro = document.getElementById("ouverture");
  if (!intro) return;
  // Si le script arrive très tard (réseau lent), le secours CSS a déjà retiré l'ouverture
  if (performance.now() > 5200) { intro.remove(); return; }
  intro.classList.add("actif");

  var canvas = intro.querySelector("canvas"), ctx = canvas.getContext("2d");
  var titre = intro.querySelector(".ouv-titre"), lettres = intro.querySelectorAll(".ouv-nom span"), sous = intro.querySelector(".ouv-sous");
  var W = 0, H = 0, dpr = 1, sol = 0, cx = 0, echelle = 1;
  var DUREE = 3.9, T_VENT = 1.96;
  // Montée des lettres : un nom long monte plus serré pour être complet avant le coup de vent (≈ 2 s)
  var longNom = lettres.length > 8;
  var debutL = longNom ? 1.0 : 1.12, dureeL = longNom ? 0.55 : 0.65;
  var pasL = Math.min(0.055, 0.38 / Math.max(1, lettres.length - 1));

  function graine(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  var R = graine(59);
  function rnd(a, b) { return a + R() * (b - a); }
  function borne(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function sortie(x) { return 1 - Math.pow(1 - x, 3); }
  function rebond(x) { var c = 1.70158, c3 = c + 1; return 1 + c3 * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); }
  function douce(x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }

  var VERTS = ["#b5dd73", "#a3cc61", "#8fb553", "#cfe89a", "#7f9a45", "#e2f2c0"];
  var branches = [], niveaux = [], feuilles = [], vol = [], pollen = [], traits = [];

  // Lutins : une feuille par couleur, dessinée une seule fois
  var RS = 40, lutins = {};
  VERTS.forEach(function (c) {
    var cv = document.createElement("canvas"), x = cv.getContext("2d");
    cv.width = Math.ceil(RS * 0.8) + 4; cv.height = RS * 2 + 4;
    x.translate(cv.width / 2, cv.height / 2);
    x.fillStyle = c; x.beginPath(); x.moveTo(0, -RS); x.quadraticCurveTo(RS * 0.7, -RS * 0.15, 0, RS); x.quadraticCurveTo(-RS * 0.7, -RS * 0.15, 0, -RS); x.fill();
    x.strokeStyle = "rgba(255,255,255,0.35)"; x.lineWidth = RS * 0.07; x.lineCap = "round";
    x.beginPath(); x.moveTo(0, -RS * 0.8); x.lineTo(0, RS * 0.92); x.stroke();
    lutins[c] = cv;
  });

  function construire() {
    R = graine(59);
    branches = []; niveaux = []; feuilles = []; vol = []; pollen = []; traits = [];
    var taille = Math.min(W, H);
    echelle = taille / 900;
    cx = W / 2; sol = H * 0.56;
    (function pousse(x, y, ang, len, ep, prof, t0) {
      var dur = prof === 0 ? 0.3 : rnd(0.12, 0.17);
      var b = { x: x, y: y, x2: x + Math.cos(ang) * len, y2: y + Math.sin(ang) * len, ep: ep, prof: prof, t0: t0, dur: dur };
      branches.push(b);
      (niveaux[prof] = niveaux[prof] || []).push(b);
      if (prof < 7 && len > 4) {
        var n = prof === 0 ? 2 : (R() < 0.3 ? 3 : 2), ouv = rnd(0.48, 0.74);
        for (var k = 0; k < n; k++) {
          var a2 = ang + (k - (n - 1) / 2) * ouv * (n === 3 ? 0.85 : 1.05) + rnd(-0.12, 0.12);
          a2 += (-Math.PI / 2 - a2) * 0.05;
          pousse(b.x2, b.y2, a2, len * rnd(0.7, 0.8), ep * 0.7, prof + 1, t0 + dur);
        }
      } else {
        var m = 2 + Math.floor(R() * 3);
        for (var j = 0; j < m; j++) {
          feuilles.push({ x: b.x2 + rnd(-9, 9) * echelle, y: b.y2 + rnd(-9, 6) * echelle, s: rnd(5, 9) * echelle, a: rnd(0, 6.28),
            c: VERTS[Math.floor(R() * VERTS.length)], t0: t0 + dur + rnd(0, 0.15), td: 0, vx: 0, vy: 0, ph: rnd(0, 6.28), rot: rnd(-8, 8) });
        }
      }
    })(cx, sol, -Math.PI / 2 + rnd(-0.03, 0.03), taille * 0.11, Math.max(2.5, taille * 0.011), 0, 0.42);
    // Téléphone : feuilles minuscules, on en garde 3 sur 4, un peu plus grandes (même arbre, moins à dessiner)
    if (W < 700) feuilles = feuilles.filter(function (f, i) { f.s *= 1.12; return i % 4 !== 3; });
    // Au coup de vent, chaque feuille de l'arbre se détache, de gauche à droite
    var minX = Infinity, maxX = -Infinity;
    feuilles.forEach(function (f) { minX = Math.min(minX, f.x); maxX = Math.max(maxX, f.x); });
    feuilles.forEach(function (f) {
      f.td = 2.0 + (f.x - minX) / Math.max(1, maxX - minX) * 0.42 + rnd(0, 0.3);
      f.vx = rnd(520, 1700) * (W / 1280); f.vy = rnd(-420, 160) * echelle; f.amp = rnd(8, 34) * echelle; f.fr = rnd(4, 9);
    });
    // Rafale : des centaines de feuilles traversent l'écran
    var nb = Math.round(Math.min(320, 120 + W * 0.14));
    for (var i = 0; i < nb; i++) {
      vol.push({ x: -rnd(20, 260), y: rnd(-0.05, 1.05) * H, s: rnd(5, 13) * echelle * 1.15, c: VERTS[Math.floor(R() * VERTS.length)],
        t0: rnd(1.95, 3.05), vx: rnd(1100, 2100) * (W / 1280), vy: rnd(-160, 120) * echelle, amp: rnd(10, 46) * echelle,
        f: rnd(4, 10), ph: rnd(0, 6.28), rot: rnd(-10, 10), a: rnd(0, 6.28) });
    }
    // Lignes de vent : fins traits clairs qui filent avec la rafale
    for (var s2 = 0; s2 < 16; s2++) traits.push({ y: rnd(0.08, 0.92) * H, t0: rnd(1.9, 2.9), v: rnd(1500, 2400) * (W / 1280), L: rnd(0.16, 0.32) * W,
      amp: rnd(8, 26) * echelle, k: rnd(0.004, 0.009) / Math.max(0.6, echelle), ph: rnd(0, 6.28), a: rnd(0.22, 0.5), ep: rnd(0.8, 1.6) });
    for (var p = 0; p < 60; p++) pollen.push({ x: rnd(0, W), y: rnd(0, H), r: rnd(0.8, 2.2) * echelle * 1.4, v: rnd(10, 26), ph: rnd(0, 6.28), a: rnd(0.25, 0.7) });
    titre.style.top = (sol + 26 * echelle) + "px";
  }

  // Feuille de taille s (rayon), tournée de ang, retournée selon flip (-1..1) : une seule copie de lutin
  function feuille(x, y, s, ang, flip, col, alpha) {
    var L = lutins[col], k = s / RS * dpr, c = Math.cos(ang), sn = Math.sin(ang), sx = flip * k;
    ctx.globalAlpha = alpha;
    ctx.setTransform(c * sx, sn * sx, -sn * k, c * k, x * dpr, y * dpr);
    ctx.drawImage(L, -L.width / 2, -L.height / 2);
  }

  // Bord organique du coup de vent : position x du bord pour une hauteur y
  function front(t) { return -0.25 * W + douce(borne((t - 2.08) / 1.25)) * 1.5 * W; }
  function bord(fx, y, t) { return fx + Math.sin(y * 0.011 + t * 3.1) * 60 * echelle + Math.sin(y * 0.029 + 1.7) * 34 * echelle + (y / H - 0.5) * W * 0.1; }
  // Le bord est échantillonné une fois par image (bx[i] à la hauteur by[i]) puis réutilisé
  var by = [], bx = [];
  function echantillonner(fx, t) {
    by.length = bx.length = 0;
    for (var y = -14; ; y += 14) { by.push(y); bx.push(bord(fx, y, t)); if (y > H + 14) break; }
  }
  // Région du fond encore présente : à droite du bord
  function cheminDroite() {
    ctx.beginPath(); ctx.moveTo(bx[0], by[0]);
    for (var i = 1; i < by.length; i++) ctx.lineTo(bx[i], by[i]);
    ctx.lineTo(W + 20, by[by.length - 1]); ctx.lineTo(W + 20, by[0]); ctx.closePath();
  }
  // Bande entre le bord et le bord décalé de d (pour le fondu)
  function bande(d) {
    ctx.beginPath(); ctx.moveTo(bx[0], by[0]);
    for (var i = 1; i < by.length; i++) ctx.lineTo(bx[i], by[i]);
    for (var j = by.length - 1; j >= 0; j--) ctx.lineTo(bx[j] + d, by[j]);
    ctx.closePath(); ctx.fill();
  }

  // Fond olive préparé une fois (copié pendant le balayage) ; avant, c'est le fond CSS qui s'affiche
  var fond = document.createElement("canvas"), fondCss = true;
  function preparerFond() {
    fond.width = canvas.width; fond.height = canvas.height;
    var f = fond.getContext("2d"), r = Math.max(W, H) * 0.75 * dpr;
    var g = f.createRadialGradient(fond.width / 2, fond.height * 0.48, 0, fond.width / 2, fond.height * 0.48, r);
    g.addColorStop(0, "#808d55"); g.addColorStop(0.5, "#66733f"); g.addColorStop(1, "#4b552e");
    f.fillStyle = g; f.fillRect(0, 0, fond.width, fond.height);
  }

  // La vidéo du héros, dessous : léger recul (1,1 → 1) pendant qu'elle se dévoile
  var heros = document.querySelector(".heros-scroll"), zoomes = [];
  function zoomHeros(t) {
    if (!zoomes.length) zoomes = Array.prototype.slice.call(document.querySelectorAll(".hs-affiche, .hs-scene canvas"));
    var z = 1 + 0.1 * (1 - sortie(borne((t - 2.15) / 1.7)));
    for (var i = 0; i < zoomes.length; i++) zoomes[i].style.transform = z > 1.0004 ? "scale(" + z.toFixed(4) + ")" : "";
  }
  function herosPret() {
    if (!heros) heros = document.querySelector(".heros-scroll");
    if (!heros) return true;
    if (heros.classList.contains("pret")) return true;
    var img = heros.querySelector(".hs-affiche img");
    return !!(img && img.complete && img.naturalWidth > 0);
  }

  function rendu(t, horloge) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, W, H);
    // 1) Fond olive. Avant le coup de vent : le fond CSS (rien à repeindre). Pendant : la copie
    //    préparée, seulement à droite du bord ; pollen et arbre restent dans cette région.
    var balaye = t > 2.0;
    if (balaye === fondCss) { fondCss = !balaye; intro.classList.toggle("balaye", balaye); }
    ctx.save();
    if (balaye) {
      echantillonner(front(t), t);
      cheminDroite(); ctx.clip();
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(fond, 0, 0); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    // 2) Pollen (il continue de flotter même si l'on attend la vidéo)
    ctx.fillStyle = "#e9f5c9";
    for (var i = 0; i < pollen.length; i++) {
      var q = pollen[i], py = ((q.y - q.v * horloge * echelle * 6) % H + H) % H;
      ctx.globalAlpha = q.a * (0.6 + 0.4 * Math.sin(horloge * 2 + q.ph));
      ctx.beginPath(); ctx.arc(q.x + Math.sin(horloge * 1.3 + q.ph) * 10, py, q.r, 0, 6.2832); ctx.fill();
    }
    ctx.globalAlpha = 1;
    // 3) Sol + arbre, qui plie au vent puis s'efface
    var vent = borne((t - 1.98) / 0.5), effacement = borne((t - 2.25) / 0.45);
    if (effacement < 1) {
      var largeurSol = sortie(borne((t - 0.08) / 0.5)) * W * 0.2;
      ctx.globalAlpha = 0.6 * (1 - effacement); ctx.strokeStyle = "#f4f1e8"; ctx.lineWidth = 1.2; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(cx - largeurSol / 2, sol); ctx.lineTo(cx + largeurSol / 2, sol); ctx.stroke();
      var penche = vent * 0.09 * (1 + 0.35 * Math.sin(t * 9)) + Math.sin(horloge * 1.6) * 0.012;
      var pc = Math.cos(penche), ps = Math.sin(penche);
      ctx.save();
      ctx.translate(cx, sol); ctx.rotate(penche); ctx.translate(-cx, -sol);
      ctx.globalAlpha = 1 - effacement; ctx.strokeStyle = "#f4ecdb";
      // Branches terminées : un seul tracé par niveau ; branches en train de pousser : une par une
      for (var nv = 0; nv < niveaux.length; nv++) {
        var lot = niveaux[nv], plein = false;
        ctx.beginPath();
        for (var b = 0; b < lot.length; b++) {
          var br = lot[b], p = borne((t - br.t0) / br.dur);
          if (p >= 1) { ctx.moveTo(br.x, br.y); ctx.lineTo(br.x2, br.y2); plein = true; }
        }
        if (plein) { ctx.lineWidth = Math.max(0.7, lot[0].ep * 0.7); ctx.stroke(); }
        for (var b2 = 0; b2 < lot.length; b2++) {
          var bg = lot[b2], pg = borne((t - bg.t0) / bg.dur);
          if (pg <= 0 || pg >= 1) continue;
          ctx.lineWidth = Math.max(0.7, bg.ep * (1 - 0.3 * pg));
          ctx.beginPath(); ctx.moveTo(bg.x, bg.y); ctx.lineTo(bg.x + (bg.x2 - bg.x) * pg, bg.y + (bg.y2 - bg.y) * pg); ctx.stroke();
        }
      }
      ctx.restore();
      // Feuilles encore accrochées : même inclinaison que l'arbre (calculée à la main)
      for (var f = 0; f < feuilles.length; f++) {
        var fe = feuilles[f];
        if (t < fe.t0 || t >= fe.td) continue;
        var rx = fe.x - cx, ry = fe.y - sol;
        feuille(cx + rx * pc - ry * ps, sol + rx * ps + ry * pc, fe.s * rebond(borne((t - fe.t0) / 0.35)),
          fe.a + penche + Math.sin(t * 6 + fe.ph) * 0.15 * vent, 1, fe.c, 1);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalAlpha = 1;
    }
    ctx.restore();
    // 4) Bord fondu en rampe linéaire : la passe n (de l'extérieur vers l'intérieur) retire 1/(N-n)
    //    de ce qui reste, sur une bande qui part du bord ; à gauche du bord, rien n'a été dessiné.
    if (balaye) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = "destination-out"; ctx.fillStyle = "#000";
      var N = W < 700 ? 10 : 14, pas = (W < 700 ? 9 : 6.5) * echelle;
      for (var n = 0; n < N - 1; n++) { ctx.globalAlpha = 1 / (N - n); bande((N - 1 - n) * pas); }
      ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
    }
    // 5) Feuilles emportées et lignes de vent, par-dessus la vidéo dévoilée
    for (var k = 0; k < feuilles.length; k++) {
      var fl = feuilles[k], d = t - fl.td;
      if (d < 0) continue;
      var x = fl.x + fl.vx * d * d * 0.85 + 90 * d, y = fl.y + fl.vy * d + 110 * d * d * echelle + Math.sin(d * fl.fr + fl.ph) * fl.amp;
      if (x > W + 40 || y < -40 || y > H + 40) continue;
      feuille(x, y, fl.s, fl.a + fl.rot * d, Math.cos(d * 9 + fl.ph), fl.c, 1);
    }
    for (var v = 0; v < vol.length; v++) {
      var o = vol[v], dt = t - o.t0;
      if (dt < 0) continue;
      var ox = o.x + o.vx * dt, oy = o.y + o.vy * dt + Math.sin(dt * o.f + o.ph) * o.amp;
      if (ox > W + 40 || oy < -40 || oy > H + 40) continue;
      feuille(ox, oy, o.s, o.a + o.rot * dt, Math.cos(dt * 8 + o.ph), o.c, 0.95);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalAlpha = 1;
    ctx.lineCap = "round";
    for (var tr = 0; tr < traits.length; tr++) {
      var o2 = traits[tr], dt2 = t - o2.t0;
      if (dt2 < 0) continue;
      var tete = -0.1 * W + o2.v * dt2, queue = tete - o2.L;
      if (queue > W) continue;
      var gr = ctx.createLinearGradient(queue, 0, tete, 0);
      gr.addColorStop(0, "rgba(244,241,232,0)"); gr.addColorStop(0.85, "rgba(244,241,232," + o2.a + ")"); gr.addColorStop(1, "rgba(244,241,232,0)");
      ctx.strokeStyle = gr; ctx.lineWidth = o2.ep * Math.max(1, echelle);
      ctx.beginPath();
      for (var xx = queue; xx <= tete; xx += 16) { var yy = o2.y + Math.sin(xx * o2.k + o2.ph + t * 2) * o2.amp; if (xx === queue) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy); }
      ctx.stroke();
    }
    // 6) Le nom : lettres qui montent, puis emportées par le vent
    for (var l = 0; l < lettres.length; l++) {
      var e = sortie(borne((t - (debutL + l * pasL)) / dureeL));
      lettres[l].style.transform = e < 1 ? "translateY(" + ((1 - e) * 110).toFixed(2) + "%)" : "none";
    }
    var s = sortie(borne((t - 1.42) / 0.8));
    sous.style.opacity = s.toFixed(3); sous.style.letterSpacing = (0.75 - 0.41 * s).toFixed(3) + "em";
    var w = borne((t - 2.02) / 0.42);
    titre.style.opacity = (1 - w).toFixed(3);
    titre.style.transform = w > 0 ? "translateX(" + (w * w * 90 * echelle).toFixed(1) + "px)" : "";
    titre.style.filter = w > 0 ? "blur(" + (w * 6).toFixed(2) + "px)" : "";
    zoomHeros(t);
    // Dès que le fond commence à partir, la page redevient cliquable
    if (t > 2.3 && !intro.classList.contains("traverse")) intro.classList.add("traverse");
  }

  function dimensionner() {
    W = window.innerWidth; H = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, W < 700 ? 1.5 : 1.75);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    preparerFond();
    construire();
  }
  dimensionner();
  window.addEventListener("resize", dimensionner);

  // Horloge : l'animation avance seule ; une interaction l'accélère jusqu'au coup de vent
  var t = 0, horloge = 0, vitesse = 1, presse = false, attente = 0, avant = performance.now(), fini = false;
  var lance = false, calmes = 0, patience = 0, polices = !(document.fonts && document.fonts.load);
  if (!polices) Promise.all([document.fonts.load('380 100px "Fraunces"'), document.fonts.load('700 15px "Manrope"')])
    .then(function () { polices = true; }, function () { polices = true; });
  function presser() {
    if (presse) return;
    presse = true;
    ["pointerdown", "keydown", "wheel", "touchstart"].forEach(function (ev) { window.removeEventListener(ev, presser, true); });
  }
  ["pointerdown", "keydown", "wheel", "touchstart"].forEach(function (ev) { window.addEventListener(ev, presser, { capture: true, passive: true }); });

  function terminer() {
    if (fini) return;
    fini = true;
    window.removeEventListener("resize", dimensionner);
    presser();
    zoomes.forEach(function (z) { z.style.transform = ""; });
    intro.remove();
  }

  function boucle(maintenant) {
    if (fini) return;
    var dt = Math.min(0.05, Math.max(0, (maintenant - avant) / 1000)); // pas de saut après un onglet en arrière-plan
    avant = maintenant;
    horloge += dt;
    // Départ quand la page est calme (3 images régulières) et les polices prêtes ; 1,2 s au plus
    if (!lance) {
      patience += dt; calmes = dt < 0.022 ? calmes + 1 : 0;
      if ((calmes >= 3 && polices) || patience > 1.2 || presse) lance = true;
      else { rendu(0, horloge); requestAnimationFrame(boucle); return; }
    }
    vitesse = presse ? (t < T_VENT ? 4 : 1.6) : 1;
    var suivant = t + dt * vitesse;
    // Avant le coup de vent, on attend que la vidéo soit prête (3,5 s au plus)
    if (suivant >= T_VENT && t < T_VENT + 0.001 && !herosPret() && attente < 3.5) { attente += dt; suivant = Math.min(suivant, T_VENT); }
    t = suivant;
    rendu(t, horloge);
    if (t >= DUREE) { terminer(); return; }
    requestAnimationFrame(boucle);
  }
  rendu(0, 0);
  if (!document.documentElement.classList.contains("capture")) requestAnimationFrame(boucle);
  window.__ouverture = { rendu: function (x) { t = x; rendu(x, x); }, stats: function () { return { t: t, attente: attente }; } };
})();
