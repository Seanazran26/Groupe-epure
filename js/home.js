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
