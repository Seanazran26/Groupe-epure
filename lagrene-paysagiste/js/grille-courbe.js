/* ==========================================================================
   Lagrene Paysagiste 59 — grille courbe (« Tilted Grid Hero »)
   --------------------------------------------------------------------------
   Port fidèle, en JavaScript natif, du composant React TiltedGridHero
   (même géométrie, mêmes valeurs par défaut) pour un site HTML statique.

   Une rangée d'images défile de droite à gauche sur l'intérieur d'un
   cylindre : au centre elle fait face au visiteur, aux extrémités elle se
   courbe vers lui puis s'efface dans la page. Une boîte CSS ne pouvant pas
   se plier, chaque image est découpée en SLICES bandes verticales, chacune
   tournée de quelques degrés autour de l'axe du cylindre ; c'est la tuile
   entière (preserve-3d) qui tourne : une seule animation par tuile, ses
   bandes ne peuvent donc jamais se désaligner. Animation transform
   uniquement (carte graphique), fondu = masque statique.

   Le seul JavaScript : un ResizeObserver qui dimensionne la boucle, et un
   gestionnaire qui donne à une tuile l'image suivante à chaque tour, hors
   de la vue. En plus : pause automatique quand la section n'est pas visible.

   Utilisation : <div class="tgh" data-grille-courbe> + un
   <script type="application/json" class="tgh-images"> [{src, alt, titre, numero}] </script>
   Options (attributs data-) : speed, tile-height, aspect, gap, axis, curve, fade.
   ========================================================================== */
(function () {
  "use strict";

  // Bandes par tuile (moins : des angles apparaissent sur les bords haut et bas).
  var SLICES = 16;
  // Distance de la caméra, en multiple du rayon du cylindre.
  var CAMERA = 1.6;
  // Une tuile ne dépasse jamais cette part de la largeur (un téléphone voit ses voisines).
  var MAX_WIDTH = 55;

  // Rayon du cylindre (part de la largeur) qui place le bord du cadre à `bend` radians.
  function arc(bend) { return (CAMERA - 1 + Math.cos(bend)) / (2 * CAMERA * Math.sin(bend)); }

  function measure(width, height, tile, aspect, gap, bend) {
    var h = Math.min((tile / 100) * height, ((MAX_WIDTH / 100) * width) / aspect);
    var radius = width * arc(bend);
    if (!(h > 0) || !(radius > 0)) return { columns: 2, sweep: 0, unit: 0, limit: 0 };
    var deg = function (rad) { return (rad * 180) / Math.PI; };
    var unit = deg(h / radius);
    var pitch = (aspect + gap / 100) * unit;
    var limit = deg(bend) + (aspect * unit) / 2;
    var columns = Math.min(60, Math.max(2, Math.ceil((2 * limit) / pitch)));
    var round = function (n) { return +n.toFixed(4); };
    var sweep = round((columns * pitch) / 2);
    return { columns: columns, sweep: sweep, unit: round(unit), limit: round(Math.min(sweep, limit)) };
  }

  var compteur = 0;
  var reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function GrilleCourbe(el) {
    var d = el.dataset;
    var speed = +d.speed || 4;
    var tileHeight = +d.tileHeight || 26;
    var aspectRatio = d.aspect ? Function("return (" + d.aspect.replace(/[^0-9./]/g, "") + ")")() : 16 / 9;
    var gap = d.gap != null ? +d.gap : 6;
    var axis = d.axis != null ? +d.axis : 56;
    var curve = d.curve != null ? +d.curve : 80;
    var fade = d.fade != null ? +d.fade : 12;
    var images = [];
    try { images = JSON.parse(el.querySelector(".tgh-images").textContent); } catch (e) { return; }
    if (!images.length) return;

    var id = "g" + (++compteur);
    var orbit = "tgh-o-" + id, tileCls = "tgh-t-" + id;
    // Courbure : celle du composant (80°) ; plus douce sur un écran étroit si data-curve-mobile
    var curveMobile = d.curveMobile != null ? +d.curveMobile : curve;
    var bend, r, radius;
    function regler(c) {
      bend = (Math.min(85, Math.max(5, c)) * Math.PI) / 180;
      r = 100 * arc(bend);
      radius = +r.toFixed(3) + "cqw";
      bande.style.perspective = +(r * CAMERA).toFixed(3) + "cqw";     // point de fuite commun
    }

    var bande = document.createElement("div");
    bande.className = "tgh-bande";
    bande.setAttribute("aria-hidden", "true");
    bande.style.perspectiveOrigin = "50% " + axis + "%";
    var mask = "linear-gradient(90deg,transparent,#000 " + fade + "%,#000 " + (100 - fade) + "%,transparent)";
    bande.style.maskImage = mask;
    bande.style.webkitMaskImage = mask;
    var style = document.createElement("style");
    el.insertBefore(style, el.firstChild);
    el.insertBefore(bande, style.nextSibling);

    // Toutes les images chargées d'avance (une tuile prend la suivante juste avant de revenir).
    images.forEach(function (im) { new Image().src = im.src; });

    function u(n) {
      return "calc(" + +n.toFixed(4) + " * min(" + tileHeight + "cqh, " + +(MAX_WIDTH / aspectRatio).toFixed(4) + "cqw))";
    }
    function turn(degres) {
      return "translateZ(" + radius + ") rotateY(" + +degres.toFixed(4) + "deg) translateZ(-" + radius + ")";
    }

    var layout = null, tuiles = [];

    function remplir(tuile, n) {                  // n = position dans la suite d'images
      var img = images[((n % images.length) + images.length) % images.length];
      if (tuile.n === n) return;
      tuile.n = n;
      tuile.imgs.forEach(function (i, k) { i.src = img.src; i.alt = k === 0 ? img.alt || "" : ""; });
      tuile.legendes.forEach(function (l) { l.innerHTML = img.titre ? "<b>" + (img.numero || "") + "</b>" + img.titre : ""; });
    }

    function construire(L) {
      var columns = L.columns, sweep = L.sweep, unit = L.unit, limit = L.limit;
      var hide = +(((sweep - limit) / (2 * sweep || 1)) * 100).toFixed(4);
      var duration = columns * speed;
      style.textContent =
        "@keyframes " + orbit + "{from{transform:" + turn(-sweep) + "}to{transform:" + turn(sweep) + "}" +
        "0%," + hide + "%," + (100 - hide) + "%,100%{visibility:hidden}" +
        (hide + 0.001) + "%," + (100 - hide - 0.001) + "%{visibility:visible}}";
      var share = aspectRatio / SLICES;
      bande.textContent = "";
      tuiles = [];
      for (var t = 0; t < columns; t++) {
        var first = columns - 1 - t;             // ordre d'entrée à l'écran
        var tuile = document.createElement("div");
        tuile.className = "tgh-tuile " + tileCls;
        tuile.style.left = "calc(50% - " + u(aspectRatio / 2) + ")";
        tuile.style.top = "calc(" + axis + "% - " + u(0.5) + ")";
        tuile.style.width = u(aspectRatio);
        tuile.style.height = u(1);
        tuile.style.animation = orbit + " " + duration + "s linear " + (-t * speed) + "s infinite";
        var info = { el: tuile, imgs: [], legendes: [], n: null, first: first, t: t };
        for (var k = 0; k < SLICES; k++) {
          var tr = document.createElement("div");
          tr.className = "tgh-tranche" + (k === 0 ? " g" : "") + (k === SLICES - 1 ? " d" : "");
          tr.style.left = u((aspectRatio - share) / 2);
          // un peu plus large que sa part : les facettes voisines se chevauchent, aucun fil ne s'ouvre
          tr.style.width = k === SLICES - 1 ? u(share) : "calc(" + u(share) + " + 3px)";
          tr.style.height = u(1);
          tr.style.transform = turn((aspectRatio / 2 - (k + 0.5) * share) * unit);
          var vis = document.createElement("div");
          vis.className = "tgh-visuel";
          vis.style.left = u(-k * share);
          vis.style.width = u(aspectRatio);
          vis.style.height = u(1);
          vis.style.fontSize = u(0.105);
          var im = document.createElement("img");
          im.draggable = false; im.decoding = "async";
          var lg = document.createElement("span");
          lg.className = "tgh-legende";
          vis.appendChild(im); vis.appendChild(lg); tr.appendChild(vis); tuile.appendChild(tr);
          info.imgs.push(im); info.legendes.push(lg);
        }
        (function (info) {
          info.el.addEventListener("animationiteration", function (e) {
            if (e.target !== info.el) return;
            var lap = Math.round(e.elapsedTime / duration);   // tours complets, même manqués
            remplir(info, lap * columns + info.first);
          });
        })(info);
        remplir(info, first);
        bande.appendChild(tuile);
        tuiles.push(info);
      }
      bande.classList.add("pret");
    }

    var ro = new ResizeObserver(function (entries) {
      var cr = entries[0].contentRect;
      var c = cr.width < 720 ? curveMobile : curve;
      var change = c !== regler.courant;
      if (change) { regler.courant = c; regler(c); }
      var next = measure(cr.width, cr.height, tileHeight, aspectRatio, gap, bend);
      if (!change && layout && layout.columns === next.columns && layout.sweep === next.sweep && layout.unit === next.unit) return;
      layout = next;
      construire(next);
    });
    ro.observe(el);

    // Pause quand la section n'est pas à l'écran (aucun travail inutile pendant le reste de la page)
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) {
        el.classList.toggle("tgh-pause", !en[0].isIntersecting || reduit);
      }, { rootMargin: "100px 0px" }).observe(el);
    }
    if (reduit) el.classList.add("tgh-pause");
  }

  document.querySelectorAll("[data-grille-courbe]").forEach(function (el) { GrilleCourbe(el); });
})();
