/* ==========================================================================
   VIN DES COPAINS — Page d'accueil
   ========================================================================== */
(function () {
  "use strict";
  var V = window.VDC, I = V.icons, esc = V.esc;
  var $ = function (s) { return document.querySelector(s); };
  var count = function (fn) { return V.PRODUITS.filter(fn).length; };
  var deux = function (n) { return (n < 10 ? "0" : "") + n; };

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

  // Univers / catégories : nuancier de robes
  var uv = $("[data-univers]");
  if (uv) {
    uv.innerHTML = V.CATEGORIES.map(function (c, i) {
      var n = count(function (p) { return (p.categories || []).indexOf(c.slug) > -1; });
      var t = c.teinte || ["#8a2a3a", "#2b0c12"];
      return '<a class="univers-card reveal reveal-d' + (i % 4 + 1) + '" href="nos-vins.html?categorie=' + c.slug + '" style="--t1:' + t[0] + ";--t2:" + t[1] + '">' +
        '<span class="uc-top"><span class="num">N° ' + deux(i + 1) + '</span><span class="robe">' + esc(c.robe || "") + "</span></span>" +
        '<span class="uc-letter" aria-hidden="true">' + esc(c.nom.replace(/^Vins?\s/, "").charAt(0).toUpperCase()) + "</span>" +
        "<h3>" + esc(c.nom) + "</h3><p>" + esc(c.note) + "</p>" +
        '<span class="meta"><span>' + (n ? V.pluriel(n, "référence") : "Découvrir") + "</span>" + I.arrow + "</span></a>";
    }).join("");
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

  // Régions
  var rl = $("[data-regions]");
  if (rl) {
    var total = V.REGIONS.length;
    rl.innerHTML = V.REGIONS.map(function (r, i) {
      var n = count(function (p) { return p.region === r.slug; });
      return '<li class="reveal"><a href="nos-vins.html?region=' + r.slug + '" data-rv="' + i + '">' +
        '<span class="idx">' + deux(i + 1) + "</span>" +
        '<span class="nm">' + esc(r.nom) + "</span>" +
        '<span class="ct">' + (n ? V.pluriel(n, "vin") : "") + "</span></a></li>";
    }).join("");
    var rvT = $("[data-rv-title]"), rvN = $("[data-rv-note]"), rvI = $("[data-rv-idx]"), rvL = $("[data-rv-link]"), last = -1;
    rvI.textContent = "— / " + deux(total);
    rl.addEventListener("mouseover", function (e) {
      var a = e.target.closest("[data-rv]");
      if (!a) return;
      var i = +a.getAttribute("data-rv");
      if (i === last) return;
      last = i;
      rl.querySelectorAll("a.active").forEach(function (x) { x.classList.remove("active"); });
      a.classList.add("active");
      var r = V.REGIONS[i], card = rvT.parentElement;
      card.classList.remove("swap"); void card.offsetWidth; card.classList.add("swap");
      rvT.textContent = r.nom;
      rvN.textContent = r.note;
      rvI.textContent = deux(i + 1) + " / " + deux(total);
      rvL.href = "nos-vins.html?region=" + r.slug;
    });
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
