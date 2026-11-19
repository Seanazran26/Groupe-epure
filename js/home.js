/* ==========================================================================
   VIN DES COPAINS — Page d'accueil
   ========================================================================== */
(function () {
  "use strict";
  var V = window.VDC, I = V.icons, esc = V.esc;
  var $ = function (s) { return document.querySelector(s); };
  var count = function (fn) { return V.PRODUITS.filter(fn).length; };
  var deux = function (n) { return (n < 10 ? "0" : "") + n; };

  // Héros scroll : boutons d'action de fin (rendez-vous, téléphone, itinéraire)
  var HC = V.CONTACT || {}, hcta = $("[data-hero-ctas]"), hcon = $("[data-hero-contact]");
  if (hcta) {
    var adrH = V.adresseComplete();
    if (HC.telephone) hcta.insertAdjacentHTML("beforeend", '<a class="btn btn-ghost-light" href="' + V.telHref() + '">Prendre rendez-vous</a>');
    if (adrH) hcta.insertAdjacentHTML("beforeend", '<a class="btn btn-ghost-light" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(adrH) + '">Itinéraire</a>');
  }
  if (hcon) hcon.innerHTML = [HC.telephone, HC.email, V.adresseComplete()].filter(Boolean).map(esc).join('<span class="sep">✦</span>');

  // Chiffres du héros
  var sr = $('[data-stat="regions"]'), sc = $('[data-stat="categories"]');
  if (sr) sr.textContent = V.REGIONS.length;
  if (sc) sc.textContent = V.CATEGORIES.length;

  // Défilant des régions (doublé pour une boucle continue)
  var mq = $("[data-marquee]");
  if (mq) {
    var line = V.REGIONS.map(function (r) { return '<a href="nos-vins.html?region=' + r.slug + '">' + esc(r.nom) + "</a>"; }).join("");
    mq.innerHTML = line + line;
  }

  // Frise de consommation + anneaux du temps
  var tl = $("[data-timeline]"), rings = $("[data-rings]");
  if (tl) {
    tl.innerHTML = V.CONSOMMATIONS.map(function (c, i) {
      var n = count(function (p) { return p.consommation === c.slug; });
      return '<li class="reveal reveal-d' + (i + 1) + '"><a href="nos-vins.html?conso=' + c.slug + '" data-ring-on="' + i + '">' +
        '<span class="dot"><i></i></span>' +
        '<div><span class="when">' + esc(c.horizon) + "</span><h3>" + esc(c.nom) + "</h3><p>" + esc(c.note) + "</p></div>" +
        '<span class="count">' + (n ? V.pluriel(n, "vin") : "Voir") + " →</span></a></li>";
    }).join("");
    var light = function (i) {
      if (!rings) return;
      rings.querySelectorAll(".ring").forEach(function (r) { r.classList.toggle("on", +r.getAttribute("data-ring") === i); });
    };
    tl.addEventListener("mouseover", function (e) { var a = e.target.closest("[data-ring-on]"); if (a) light(+a.getAttribute("data-ring-on")); });
    tl.addEventListener("mouseleave", function () { light(-1); });
  }

  // La Cave : lien Instagram
  var ig = $("[data-insta]"), C0 = V.CONTACT || {};
  if (ig && C0.instagram) {
    var handle = "@" + C0.instagram.replace(/\/+$/, "").split("/").pop();
    ig.innerHTML = '<a class="btn btn-wine" href="' + esc(C0.instagram) + '" target="_blank" rel="noopener">' + I.instagram + " Suivre " + esc(handle) + "</a>" +
      '<span class="insta-note">Nouveautés, coups de cœur et dates des ateliers</span>';
  }

  // La Cave : carte de visite
  var C = V.CONTACT || {}, vc = $("[data-visit-card]");
  if (vc) {
    var adr = V.adresseComplete();
    var tels = [C.telephone, C.mobile].filter(Boolean).map(function (t) { return '<a href="' + V.telHref(t) + '">' + esc(t) + "</a>"; }).join("<br>");
    var hor = (C.horaires || []).map(function (h) { return esc(h[0]) + "<br>" + esc(h[1]); }).join("<br>");
    vc.innerHTML =
      '<div class="vc-head"><span class="vc-orn" aria-hidden="true"><i></i>✦<i></i></span><span class="vc-brand">Vin <em>des</em> Copains</span><span class="vc-sub">Cave à vins · ' + esc(C.quartier || "") + "</span></div>" +
      '<dl class="vc-grid">' +
        "<div><dt>Adresse</dt><dd>" + (adr ? esc(C.adresse || "") + "<br>" + esc([C.codePostal, C.ville].filter(Boolean).join(" ")) : '<span class="ph">Adresse</span>') + "</dd></div>" +
        "<div><dt>Téléphone</dt><dd>" + (tels || '<span class="ph">Téléphone</span>') + "</dd></div>" +
        "<div><dt>E-mail</dt><dd>" + (C.email ? '<a href="mailto:' + esc(C.email) + '">' + esc(C.email) + "</a>" : '<span class="ph">E-mail</span>') + "</dd></div>" +
        "<div><dt>Horaires</dt><dd>" + (hor || '<span class="ph">Horaires</span>') + "</dd></div>" +
      "</dl>" +
      (C.noteHoraires ? '<p class="vc-note">' + esc(C.noteHoraires) + "</p>" : "") +
      '<div class="vc-actions">' +
        (adr ? '<a class="btn btn-dark" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(adr) + '">Itinéraire ' + I.arrow + "</a>" : "") +
        (C.telephone ? '<a class="btn btn-ghost" href="' + V.telHref() + '">Appeler</a>' : "") +
      "</div>";
  }

  V.observe();
})();

/* ==========================================================================
   Le concept : la photo plein écran se resserre en voûte au défilement
   Même principe que le composant « SVG clip mask » (forme « arch », mode « scroll »,
   courbe de vitesse cubic-bezier(.645, .045, .355, 1)), en CSS natif, sans bibliothèque :
   la découpe est un rectangle dont les deux coins du haut deviennent une demi-ellipse
   (clip-path: inset(… round …)), recalculée à chaque image pendant le défilement.
   Derrière, le fond brun de la section apparaît ; un filet doré épouse la voûte.
   Animations réduites (réglage du système) : la voûte finale, sans mouvement.
   ========================================================================== */
(function () {
  "use strict";
  var media = document.querySelector("[data-voute]");
  if (!media) return;
  var arch = media.querySelector(".concept-arch"), line = media.querySelector(".concept-arch-line");
  var test = "inset(0px 1px 0px 1px round 1px 1px 0px 0px / 1px 1px 0px 0px)";
  var prop = window.CSS && CSS.supports
    ? (CSS.supports("clip-path", test) ? "clipPath" : CSS.supports("-webkit-clip-path", test) ? "webkitClipPath" : "")
    : "";
  if (!prop || !arch) return;                    // navigateur trop ancien : la photo reste en plein cadre
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var W = 0, H = 0, last = -1, raf = 0, actif = false;

  // courbe de vitesse du composant d'origine (EASE_MOVE) : cubic-bezier(.645, .045, .355, 1)
  function bezier(x1, y1, x2, y2) {
    function A(p1, p2) { return 1 - 3 * p2 + 3 * p1; }
    function B(p1, p2) { return 3 * p2 - 6 * p1; }
    function C(p1) { return 3 * p1; }
    function at(t, p1, p2) { return ((A(p1, p2) * t + B(p1, p2)) * t + C(p1)) * t; }
    function slope(t, p1, p2) { return 3 * A(p1, p2) * t * t + 2 * B(p1, p2) * t + C(p1); }
    return function (x) {
      if (x <= 0) return 0;
      if (x >= 1) return 1;
      var t = x, i;
      for (i = 0; i < 6; i++) {                   // Newton
        var s = slope(t, x1, x2);
        if (Math.abs(s) < 1e-6) break;
        t -= (at(t, x1, x2) - x) / s;
      }
      if (!(t >= 0 && t <= 1) || Math.abs(at(t, x1, x2) - x) > 1e-4) {   // secours : dichotomie
        var lo = 0, hi = 1;
        t = x;
        for (i = 0; i < 30; i++) {
          var v = at(t, x1, x2);
          if (Math.abs(v - x) < 1e-5) break;
          if (v < x) lo = t; else hi = t;
          t = (lo + hi) / 2;
        }
      }
      return at(t, y1, y2);
    };
  }
  var ease = bezier(0.645, 0.045, 0.355, 1);

  function forme() {
    // voûte finale : un peu plus large sur mobile (les trois bouteilles restent entières)
    var m = W < 721;
    return { cote: m ? 0.05 : 0.1, montee: m ? 0.36 : 0.42, haut: Math.min(H * 0.05, 44) };
  }
  function px(n) { return (Math.round(n * 10) / 10) + "px"; }
  function dessiner(e) {
    var f = forme();
    var L = e * f.cote * W, T = e * f.haut;
    var rx = px(e * (W - 2 * L) / 2), ry = px(e * f.montee * H);
    arch.style[prop] = "inset(" + px(T) + " " + px(L) + " 0px " + px(L) + " round " + rx + " " + rx + " 0px 0px / " + ry + " " + ry + " 0px 0px)";
    media.style.setProperty("--e", e.toFixed(3));
    if (line) {
      line.style.left = line.style.right = px(L);
      line.style.top = px(T);
      line.style.borderRadius = rx + " " + rx + " 0 0 / " + ry + " " + ry + " 0 0";
      line.style.opacity = (e * 0.9).toFixed(3);
    }
  }
  function progres() {
    // comme le composant (offset ["start 0.9", "end 0.6"]) : 0 quand le haut de la photo atteint 90 % de
    // la hauteur de l'écran, 1 quand son bas atteint 60 % — la voûte est donc finie tant qu'on la voit.
    // Mobile (photo moins haute que l'écran) : elle entre d'abord en entier, puis se resserre en montant.
    var r = media.getBoundingClientRect(), vh = window.innerHeight || document.documentElement.clientHeight;
    var court = r.height < vh * 0.6;
    var debut = vh * (court ? 0.7 : 0.9), fin = Math.min(vh * 0.6 - r.height, vh * 0.1);
    return Math.min(1, Math.max(0, (debut - r.top) / (debut - fin)));
  }
  function maj() {
    raf = 0;
    var e = reduce ? 1 : ease(progres());
    if (Math.abs(e - last) < 0.0005) return;     // rien n'a changé : aucune écriture
    last = e;
    dessiner(e);
  }
  function demande() { if (!raf) raf = requestAnimationFrame(maj); }
  function mesure() { W = media.clientWidth; H = media.clientHeight; last = -1; demande(); }

  mesure();
  window.addEventListener("resize", mesure);
  if (reduce) return;
  // le défilement n'est écouté que lorsque la section est proche de l'écran
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es) {
      var v = es[es.length - 1].isIntersecting;
      if (v && !actif) { actif = true; window.addEventListener("scroll", demande, { passive: true }); }
      else if (!v && actif) { actif = false; window.removeEventListener("scroll", demande); }
      demande();
    }, { rootMargin: "200px 0px" }).observe(media);
  } else {
    window.addEventListener("scroll", demande, { passive: true });
  }
})();
