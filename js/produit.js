/* ==========================================================================
   VIN DES COPAINS — Fiche produit
   ========================================================================== */
(function () {
  "use strict";
  var V = window.VDC, I = V.icons, esc = V.esc;
  var $ = function (s) { return document.querySelector(s); };
  var id = new URLSearchParams(location.search).get("id");
  var p = V.produit(id) || null;
  var box = $("[data-pdp]");

  if (!p) {
    box.innerHTML = '<div class="empty-state" style="margin-top:40px">' + I.glass +
      "<h3>Ce vin n'est plus disponible</h3><p>Il a peut-être trouvé preneur… Découvrez le reste de notre cave.</p>" +
      '<a class="btn btn-dark" href="cave.html">Retour à la cave ' + I.arrow + "</a></div>";
    $("[data-related-wrap]").style.display = "none";
    return;
  }

  var reg = V.region(p.region), co = V.conso(p.consommation), ci = V.consoIndex(p.consommation);
  var cats = (p.categories || []).map(V.categorie).filter(Boolean);
  var main = cats.filter(function (c) { return c.slug !== "vins-bio"; })[0] || cats[0];
  var type = V.typeVin(p);
  document.title = p.nom + " — Vin des Copains";

  var SERVICE = {
    rouge:  "Servir entre 15 et 18 °C selon sa structure. N'hésitez pas à l'ouvrir une heure à l'avance, voire à le carafer s'il est jeune et charpenté.",
    blanc:  "Servir frais, entre 10 et 12 °C. Les blancs les plus amples gagnent à être servis un peu moins froids pour révéler leurs arômes.",
    rose:   "Servir bien frais, entre 8 et 10 °C, à l'apéritif ou sur une cuisine ensoleillée.",
    bulles: "Servir entre 6 et 8 °C, dans un verre à vin plutôt qu'une flûte pour mieux apprécier ses arômes."
  };
  var GARDE = [
    "Ce vin est prêt à boire : profitez-en dès maintenant pour savourer tout son fruit.",
    "Ce vin gagnera en harmonie après 2 à 3 ans de repos, couché, à l'abri de la lumière.",
    "Ce vin possède une belle structure : il évoluera avec grâce pendant 5 à 10 ans dans de bonnes conditions.",
    "Un vin de grande garde : à oublier en cave une dizaine d'années, à température constante (12 – 14 °C)."
  ];

  var C = V.CONTACT || {}, L = C.livraison || {};
  var livraisonTxt = "Bouteilles conditionnées dans des cartons sécurisés de 3, 6 ou 12 bouteilles, livrées par " + esc(L.transporteur || "Colissimo") + " sous " + esc(L.delai || "2 à 3 jours") +
    " (à domicile, au travail ou en point relais). Participation aux frais : " + V.prix(L.prix || 0) + " pour 3, 6 ou 9 bouteilles, offerte dès " + (L.offerteDes || 12) + " bouteilles." +
    (C.adresse ? " Retrait possible à la cave, " + esc(C.adresse) + " – " + esc(C.ville || "") + ", sur rendez-vous." : "");
  var desc = p.description || ((reg ? reg.note + " " : "") + (main ? main.note : ""));
  var meter = V.CONSOMMATIONS.map(function (c, i) { return "<span" + (i <= ci ? ' class="on"' : "") + "></span>"; }).join("");
  var names = V.CONSOMMATIONS.map(function (c, i) { return "<span" + (i === ci ? ' class="on"' : "") + ">" + esc(c.nom) + "</span>"; }).join("");

  box.innerHTML =
    '<nav class="crumbs dark" aria-label="Fil d\'Ariane"><a href="index.html">Accueil</a><span>/</span><a href="cave.html">La Cave</a>' +
      (main ? '<span>/</span><a href="cave.html?categorie=' + main.slug + '">' + esc(main.nom) + "</a>" : "") +
      "<span>/</span><span>" + esc(p.nom) + "</span></nav>" +
    '<div class="pdp-grid">' +
      '<div class="pdp-media"><span class="ring"></span><div class="product-tags">' + V.tagsHTML(p) + "</div>" + V.visuel(p) + "</div>" +
      '<div class="pdp-info">' +
        '<span class="product-region">' + esc(reg ? reg.nom : "") + "</span>" +
        "<h1>" + esc(p.nom) + "</h1>" +
        '<div class="pdp-price">' + V.prix(p.prix) + "<small>la bouteille" + (p.contenance ? " · " + esc(p.contenance) : "") + "</small></div>" +
        '<p class="pdp-desc">' + esc(desc) + "</p>" +
        '<dl class="pdp-specs">' +
          "<div><dt>Région</dt><dd>" + (reg ? '<a href="cave.html?region=' + reg.slug + '">' + esc(reg.nom) + "</a>" : "—") + "</dd></div>" +
          "<div><dt>Catégorie</dt><dd>" + (cats.length ? cats.map(function (c) { return '<a href="cave.html?categorie=' + c.slug + '">' + esc(c.nom) + "</a>"; }).join("<br>") : "—") + "</dd></div>" +
          "<div><dt>Consommation</dt><dd>" + (co ? '<a href="cave.html?conso=' + co.slug + '">' + esc(co.nom) + "</a>" : "—") + "</dd></div>" +
        "</dl>" +
        (co ? '<div class="garde-meter"><div class="lbl"><span>Potentiel de garde</span><span>' + esc(co.horizon) + '</span></div><div class="track">' + meter + '</div><div class="names">' + names + "</div></div>" : "") +
        '<div class="buy-row"><div class="qty"><button data-q-dec aria-label="Moins">−</button><span data-q-val>1</span><button data-q-inc aria-label="Plus">+</button></div>' +
          '<button class="btn btn-wine" data-buy>Ajouter au panier ' + I.arrow + "</button></div>" +
        '<div class="reassure">' +
          "<div>" + I.chat + "Conseil de caviste</div>" +
          "<div>" + I.box + "Emballage soigné</div>" +
          "<div>" + I.lock + "Paiement sécurisé</div>" +
        "</div>" +
        '<div class="accordion">' +
          "<details open><summary>Conseils de service</summary><p>" + SERVICE[type] + "</p></details>" +
          "<details><summary>Garde &amp; conservation</summary><p>" + (ci > -1 ? GARDE[ci] : GARDE[0]) + "</p></details>" +
          "<details><summary>Livraison &amp; retrait</summary><p>" + livraisonTxt + "</p></details>" +
        "</div>" +
      "</div>" +
    "</div>";

  var q = 1, qv = $("[data-q-val]");
  $("[data-q-dec]").addEventListener("click", function () { q = Math.max(1, q - 1); qv.textContent = q; });
  $("[data-q-inc]").addEventListener("click", function () { q = Math.min(99, q + 1); qv.textContent = q; });
  $("[data-buy]").addEventListener("click", function () { V.ajouter(p.id, q); });

  // Suggestions : même région ou même catégorie principale
  var rel = V.PRODUITS.filter(function (x) { return x.id !== p.id; }).map(function (x) {
    var s = 0;
    if (x.region === p.region) s += 2;
    if (main && (x.categories || []).indexOf(main.slug) > -1) s += 3;
    if (x.consommation === p.consommation) s += 1;
    return { x: x, s: s };
  }).sort(function (a, b) { return b.s - a.s; }).slice(0, 4).map(function (o) { return o.x; });
  if (rel.length) $("[data-related]").innerHTML = rel.map(V.carte).join("");
  else $("[data-related-wrap]").style.display = "none";

  V.observe();
})();
