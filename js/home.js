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

  // La Cave : fiche de contact (carte photo) — toutes les informations viennent de js/data.js
  var C = V.CONTACT || {}, vc = $("[data-visit-card]");
  if (vc) {
    var adr = V.adresseComplete();
    var tels = [C.telephone, C.mobile].filter(Boolean).map(function (t) { return '<a href="' + V.telHref(t) + '">' + esc(t) + "</a>"; }).join("<br>");
    var hor = (C.horaires || []).map(function (h) { return esc(h[0]) + " · " + esc(h[1]); }).join("<br>");
    vc.innerHTML =
      '<div class="carte-tete">' +
        '<div><h3 class="carte-nom">Vin <em>des</em> Copains</h3><p class="carte-sous">Cave à vins · ' + esc(C.quartier || "") + "</p></div>" +
        '<span class="carte-logo" aria-hidden="true">✦</span>' +
      "</div>" +
      (/rendez-vous/i.test(C.noteHoraires || "") ? '<span class="carte-pastille">Retrait sur rendez-vous</span>' : "") +
      '<div class="carte-bas">' +
        '<dl class="carte-grille">' +
          "<div><dt>Adresse</dt><dd>" + (adr ? esc(C.adresse || "") + "<br>" + esc([C.codePostal, C.ville].filter(Boolean).join(" ")) : '<span class="ph">Adresse</span>') + "</dd></div>" +
          "<div><dt>Téléphone</dt><dd>" + (tels || '<span class="ph">Téléphone</span>') + "</dd></div>" +
          '<div class="large"><dt>E-mail</dt><dd>' + (C.email ? '<a href="mailto:' + esc(C.email) + '">' + esc(C.email) + "</a>" : '<span class="ph">E-mail</span>') + "</dd></div>" +
          '<div class="large"><dt>Horaires</dt><dd>' + (hor || '<span class="ph">Horaires</span>') + "</dd></div>" +
        "</dl>" +
        (C.noteHoraires ? '<p class="carte-note">' + esc(C.noteHoraires) + "</p>" : "") +
        '<div class="carte-actions">' +
          (adr ? '<a class="btn" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(adr) + '">Itinéraire ' + I.arrow + "</a>" : "") +
          (C.telephone ? '<a class="btn" href="' + V.telHref() + '">Appeler</a>' : "") +
        "</div>" +
      "</div>";
  }

  V.observe();
})();

/* ==========================================================================
   La Cave : la fiche de contact s'incline vers la souris (ordinateur)
   Même principe que le composant « InteractiveProductCard » : jusqu'à 8° d'inclinaison et
   léger grossissement ; en plus, la photo et le texte glissent un peu en sens contraire
   (effet de profondeur), sans sortir des bords arrondis de la carte.
   Écran tactile ou animations réduites : carte immobile.
   ========================================================================== */
(function () {
  "use strict";
  var card = document.querySelector("[data-tilt]");
  if (!card || !window.matchMedia) return;
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var raf = 0, mx = 0, my = 0;
  function poser() {
    raf = 0;
    card.style.transform = "perspective(1000px) rotateX(" + (my * -8).toFixed(2) + "deg) rotateY(" + (mx * 8).toFixed(2) + "deg) scale3d(1.05, 1.05, 1.05)";
    card.style.setProperty("--mx", mx.toFixed(3));
    card.style.setProperty("--my", my.toFixed(3));
  }
  card.addEventListener("mousemove", function (e) {
    var r = card.getBoundingClientRect();
    mx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
    my = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
    card.classList.add("is-tilt");
    if (!raf) raf = requestAnimationFrame(poser);
  });
  card.addEventListener("mouseleave", function () {
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    card.classList.remove("is-tilt");
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    card.style.setProperty("--mx", "0");
    card.style.setProperty("--my", "0");
  });
})();
