/* ==========================================================================
   VIN DES COPAINS — Script commun (en-tête, pied de page, panier, recherche…)
   ========================================================================== */
(function () {
  "use strict";
  var V = window.VDC;

  /* ---------- Utilitaires ---------- */
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var euro = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });
  var bySlug = function (list, slug) { for (var i = 0; i < list.length; i++) if (list[i].slug === slug) return list[i]; return null; };

  V.esc = esc;
  V.store = store;
  V.prix = function (n) { return euro.format(n || 0); };
  V.region = function (s) { return bySlug(V.REGIONS, s); };
  V.categorie = function (s) { return bySlug(V.CATEGORIES, s); };
  V.conso = function (s) { return bySlug(V.CONSOMMATIONS, s); };
  V.consoIndex = function (s) { for (var i = 0; i < V.CONSOMMATIONS.length; i++) if (V.CONSOMMATIONS[i].slug === s) return i; return -1; };
  V.produit = function (id) { for (var i = 0; i < V.PRODUITS.length; i++) if (V.PRODUITS[i].id === id) return V.PRODUITS[i]; return null; };
  V.pluriel = function (n, s, p) { return n + " " + (n > 1 ? (p || s + "s") : s); };

  /* ---------- Icônes ---------- */
  var I = V.icons = {
    arrow: '<svg class="arrow" viewBox="0 0 22 8" fill="none" stroke="currentColor" stroke-width="1"><path d="M0 4h21M17.5 .5 21 4l-3.5 3.5"/></svg>',
    arrowL: '<svg viewBox="0 0 22 8" fill="none" stroke="currentColor" stroke-width="1"><path d="M22 4H1M4.5 .5 1 4l3.5 3.5"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg>',
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M5 8h14l-1 13H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="m5 5 14 14M19 5 5 19"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M3 7h18M3 12h12M3 17h18"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M12 5v14M5 12h14"/></svg>',
    filter: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M4 6h16M7 12h10M10 18h4"/></svg>',
    glass: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1"><path d="M13 4h14c0 9-2 15-7 15s-7-6-7-15Z"/><path d="M13.6 10h12.8"/><path d="M20 19v13M14 35h12"/></svg>',
    leaf: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1"><path d="M8 32C8 16 18 8 33 7c0 15-8 25-24 25Z"/><path d="M8 32 24 16"/></svg>',
    cellar: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1"><path d="M5 34V17L20 6l15 11v17"/><circle cx="14" cy="23" r="3"/><circle cx="26" cy="23" r="3"/><circle cx="20" cy="30" r="3"/><circle cx="14" cy="30" r="3" /><circle cx="26" cy="30" r="3"/></svg>',
    gift: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1"><path d="M6 15h28v6H6zM8 21h24v14H8zM20 15v20"/><path d="M20 15c-3-6-10-6-9-1 1 3 9 1 9 1Zm0 0c3-6 10-6 9-1-1 3-9 1-9 1Z"/></svg>',
    chat: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1"><path d="M6 9h28v18H17l-7 6v-6H6z"/><path d="M12 16h16M12 21h10"/></svg>',
    lock: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1"><rect x="9" y="17" width="22" height="16" rx="1"/><path d="M14 17v-4a6 6 0 0 1 12 0v4M20 23v4"/></svg>',
    box: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1"><path d="M6 13 20 6l14 7v15l-14 7-14-7z"/><path d="m6 13 14 7 14-7M20 20v15"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r=".6" fill="currentColor"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-7.5H16l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8v3h2.6V21h2.9Z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="3" y="5" width="18" height="14" rx="1"/><path d="m3.5 6 8.5 7 8.5-7"/></svg>'
  };

  V.mark = '<span class="brand-mark" aria-hidden="true"><i></i>✦<i></i></span>';

  V.brandHTML = function (sub) {
    return V.mark + '<span class="brand-name">Vin <em>des</em> Copains</span>' +
      (sub === false ? "" : '<span class="brand-sub">' + (sub || "Cave à vins · Vieux-Lille") + "</span>");
  };

  /* ---------- Bouteille illustrée (quand il n'y a pas de photo) ---------- */
  var uid = 0;
  var SHAPES = {
    bordeaux:  { body: "M87 22H113V168C113 196 138 200 138 234V566Q138 580 124 580H76Q62 580 62 566V234C62 200 87 196 87 168Z", cap: [84, 116, 108], label: [70, 130, 330, 482], hl: [72, 250, 520], max: 10 },
    bourgogne: { body: "M88 22H112V150C112 210 140 230 140 300V566Q140 580 126 580H74Q60 580 60 566V300C60 230 88 210 88 150Z", cap: [85, 115, 112], label: [68, 132, 352, 498], hl: [70, 310, 540], max: 10 },
    flute:     { body: "M90 22H110V160C110 230 128 250 128 320V566Q128 580 116 580H84Q72 580 72 566V320C72 250 90 230 90 160Z", cap: [87, 113, 118], label: [78, 122, 376, 504], hl: [80, 330, 550], max: 7 },
    champagne: { body: "M84 22H116V160C116 200 142 210 142 250V562Q142 580 124 580H76Q58 580 58 562V250C58 210 84 200 84 160Z", cap: [81, 119, 196], label: [66, 134, 330, 470], hl: [68, 268, 540], max: 10, foil: true }
  };
  var TINTS = {
    rouge:  { g: ["#170507", "#4a121c", "#2a0a10", "#0e0304"], cap: ["#7a2433", "#4a1119"], lab: "#f3ece1", ink: "#2b0c12" },
    blanc:  { g: ["#5e5a24", "#c9be72", "#8b8440", "#4a4618"], cap: ["#d4b680", "#9a7845"], lab: "#faf6f0", ink: "#3b3313" },
    rose:   { g: ["#b9675a", "#f5c6b6", "#e09a88", "#a35246"], cap: ["#efe4d4", "#bfae96"], lab: "#fbf7f1", ink: "#6a1f2c" },
    bulles: { g: ["#0c140e", "#334a37", "#1a281c", "#070c08"], cap: ["#e2c588", "#8d6a34"], lab: "#f4ede0", ink: "#1d2a1f" }
  };
  function wrap(text, max) {
    var words = String(text).split(/\s+/), lines = [], cur = "";
    words.forEach(function (w) {
      if (!cur) cur = w;
      else if ((cur + " " + w).length <= max) cur += " " + w;
      else { lines.push(cur); cur = w; }
    });
    if (cur) lines.push(cur);
    return lines;
  }
  V.typeVin = function (p) {
    var c = p.categories || [];
    if (c.indexOf("fines-bulles") > -1) return "bulles";
    if (c.indexOf("vins-roses") > -1) return "rose";
    if (c.indexOf("vins-blancs") > -1) return "blanc";
    return "rouge";
  };
  V.bottleSVG = function (p) {
    var type = V.typeVin(p);
    var shape = "bordeaux";
    if (type === "bulles") shape = "champagne";
    else if (p.region === "alsace") shape = "flute";
    else if (type === "rose" || ["bourgogne", "beaujolais", "loire", "loire-pouilly-fume", "cote-roannaise", "cote-roannaise-urfe", "vallee-du-rhone"].indexOf(p.region) > -1) shape = "bourgogne";
    var S = SHAPES[shape], T = TINTS[type], id = "b" + (++uid);
    var L = S.label, lw = L[1] - L[0], cx = 100;
    var reg = V.region(p.region);
    var lines = wrap(p.nom, S.max);
    var fs = lines.length > 3 ? 10 : (shape === "flute" ? 11.5 : 14.5);
    if (lines.length > 4) lines = lines.slice(0, 4);
    var lh = fs * 1.08, ty = (L[2] + L[3]) / 2 - ((lines.length - 1) * lh) / 2 + 6;
    var txt = lines.map(function (l, i) {
      return '<text x="' + cx + '" y="' + (ty + i * lh).toFixed(1) + '" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif" font-size="' + fs + '" font-weight="600" fill="' + T.ink + '">' + esc(l) + "</text>";
    }).join("");
    var cap = S.foil
      ? '<path d="M' + S.cap[0] + ' 18H' + S.cap[1] + 'V168C' + S.cap[1] + ' 184 126 190 130 ' + S.cap[2] + 'H70C74 190 ' + S.cap[0] + ' 184 ' + S.cap[0] + ' 168Z" fill="url(#c' + id + ')"/>' +
        '<path d="M' + S.cap[0] + ' 150H' + S.cap[1] + '" stroke="' + T.cap[1] + '" stroke-width="1.2" opacity=".6"/>'
      : '<rect x="' + S.cap[0] + '" y="18" width="' + (S.cap[1] - S.cap[0]) + '" height="' + (S.cap[2] - 18) + '" rx="2" fill="url(#c' + id + ')"/>' +
        '<path d="M' + S.cap[0] + ' ' + (S.cap[2] - 8) + 'H' + S.cap[1] + '" stroke="' + T.cap[1] + '" stroke-width="1" opacity=".7"/>';
    return '<svg class="bottle-svg" viewBox="0 0 200 600" role="img" aria-label="' + esc(p.nom) + '">' +
      "<defs>" +
      '<linearGradient id="g' + id + '" x1="0" x2="1"><stop offset="0" stop-color="' + T.g[3] + '"/><stop offset=".28" stop-color="' + T.g[1] + '"/><stop offset=".55" stop-color="' + T.g[2] + '"/><stop offset="1" stop-color="' + T.g[0] + '"/></linearGradient>' +
      '<linearGradient id="c' + id + '" x1="0" x2="1"><stop offset="0" stop-color="' + T.cap[1] + '"/><stop offset=".35" stop-color="' + T.cap[0] + '"/><stop offset="1" stop-color="' + T.cap[1] + '"/></linearGradient>' +
      "</defs>" +
      '<path d="' + S.body + '" fill="url(#g' + id + ')"/>' +
      cap +
      '<rect x="' + S.hl[0] + '" y="' + S.hl[1] + '" width="5" height="' + (S.hl[2] - S.hl[1]) + '" rx="2.5" fill="#fff" opacity=".13"/>' +
      '<rect x="' + L[0] + '" y="' + L[2] + '" width="' + lw + '" height="' + (L[3] - L[2]) + '" fill="' + T.lab + '"/>' +
      '<rect x="' + (L[0] + 4) + '" y="' + (L[2] + 4) + '" width="' + (lw - 8) + '" height="' + (L[3] - L[2] - 8) + '" fill="none" stroke="#b48e5a" stroke-width=".7"/>' +
      '<text x="' + cx + '" y="' + (L[2] + 20) + '" text-anchor="middle" font-family="Jost, Arial, sans-serif" font-size="5.6" letter-spacing="1.6" fill="#b48e5a">VIN DES COPAINS</text>' +
      '<path d="M' + (cx - 10) + " " + (L[2] + 27) + "H" + (cx + 10) + '" stroke="#b48e5a" stroke-width=".6"/>' +
      txt +
      '<text x="' + cx + '" y="' + (L[3] - 13) + '" text-anchor="middle" font-family="Jost, Arial, sans-serif" font-size="5.4" letter-spacing="1.2" fill="' + T.ink + '" opacity=".75">' + esc(((reg && reg.nom) || "").toUpperCase().slice(0, 22)) + "</text>" +
      "</svg>";
  };

  V.visuel = function (p) {
    if (p.image) return '<img class="photo" src="' + esc(p.image) + '" alt="' + esc(p.nom) + '" loading="lazy" data-pid="' + esc(p.id) + '" onerror="VDC.imgFallback(this)">';
    return V.bottleSVG(p);
  };
  V.imgFallback = function (img) {
    var p = V.produit(img.getAttribute("data-pid"));
    if (!p) return;
    var t = document.createElement("div");
    t.innerHTML = V.bottleSVG(p);
    img.replaceWith(t.firstChild);
  };

  V.consoDots = function (slug) {
    var idx = V.consoIndex(slug), h = '<span class="conso-dots" aria-hidden="true">';
    for (var i = 0; i < V.CONSOMMATIONS.length; i++) h += "<i" + (i <= idx ? ' class="on"' : "") + "></i>";
    return h + "</span>";
  };

  V.tagsHTML = function (p) {
    var c = p.categories || [], h = "";
    c.forEach(function (s) {
      if (s === "vins-bio") return;
      var cat = V.categorie(s);
      if (cat) h += '<span class="tag">' + esc(cat.court) + "</span>";
    });
    if (c.indexOf("vins-bio") > -1) h += '<span class="tag bio">Bio</span>';
    if (p.nouveau) h = '<span class="tag dark">Nouveau</span>' + h;
    return h;
  };

  V.carte = function (p) {
    var reg = V.region(p.region), co = V.conso(p.consommation);
    var url = "produit.html?id=" + encodeURIComponent(p.id);
    return '<article class="product-card">' +
      '<div class="product-visual">' +
        '<a class="product-media" href="' + url + '" aria-label="' + esc(p.nom) + '">' +
          '<div class="product-tags">' + V.tagsHTML(p) + "</div>" +
          V.visuel(p) +
        "</a>" +
        '<div class="product-quick"><button class="btn btn-dark" data-add="' + esc(p.id) + '">Ajouter au panier</button></div>' +
      "</div>" +
      '<div class="product-info">' +
        '<span class="product-region">' + esc(reg ? reg.nom : "") + "</span>" +
        '<h3 class="product-name"><a href="' + url + '">' + esc(p.nom) + "</a></h3>" +
        (co ? '<span class="product-conso">' + V.consoDots(p.consommation) + esc(co.nom) + "</span>" : "") +
        '<div class="product-bottom"><span class="product-price">' + V.prix(p.prix) + "</span>" +
        '<button class="product-add" data-add="' + esc(p.id) + '" aria-label="Ajouter ' + esc(p.nom) + ' au panier">' + I.plus + "</button></div>" +
      "</div>" +
    "</article>";
  };

  /* ---------- Emplacements réservés (tant que la cave est vide) ---------- */
  V.emplacements = function (n, label) {
    var h = "";
    for (var i = 1; i <= n; i++) {
      h += '<article class="product-card is-slot" aria-hidden="true">' +
        '<div class="product-visual"><div class="product-media slot-media">' +
          '<span class="slot-frame"></span>' +
          '<span class="slot-num">N° ' + (i < 10 ? "0" : "") + i + "</span>" +
          '<span class="slot-label">Cuvée<br><em>à venir</em></span>' +
        "</div></div>" +
        '<div class="product-info">' +
          '<span class="product-region">' + esc(label || "Région") + "</span>" +
          '<h3 class="product-name"><span class="slot-line"></span><span class="slot-line short"></span></h3>' +
          '<span class="product-conso">' + V.consoDots("") + "Consommation</span>" +
          '<div class="product-bottom"><span class="product-price">— €</span><span class="product-add">' + I.plus + "</span></div>" +
        "</div></article>";
    }
    return h;
  };

  /* ---------- En-tête ---------- */
  function megaHTML() {
    var cats = V.CATEGORIES.map(function (c) { return '<li><a href="cave.html?categorie=' + c.slug + '">' + esc(c.nom) + "</a></li>"; }).join("");
    var cons = V.CONSOMMATIONS.map(function (c) { return '<li><a href="cave.html?conso=' + c.slug + '">' + esc(c.nom) + "</a></li>"; }).join("");
    var regs = V.REGIONS.map(function (r) { return '<li><a href="cave.html?region=' + r.slug + '">' + esc(r.nom) + "</a></li>"; }).join("");
    return '<div class="mega"><div class="container mega-inner">' +
      "<div><h4>Catégories</h4><ul>" + cats + '<li><a href="cave.html">Toute la cave</a></li></ul></div>' +
      "<div><h4>Consommation</h4><ul>" + cons + "</ul></div>" +
      '<div><h4>Régions</h4><ul class="cols-2">' + regs + "</ul></div>" +
      '<a class="mega-feature" href="cave.html"><span class="mf-orn" aria-hidden="true">✦</span><div><span class="s">Découvrir</span><span class="t">Toute <em>la cave</em></span></div></a>' +
    "</div></div>";
  }

  function headerHTML(active) {
    var a = function (k) { return active === k ? ' class="active"' : ""; };
    var L = (V.CONTACT || {}).livraison || {};
    return '<div class="announce">Livraison offerte dès ' + (L.offerteDes || 12) + ' bouteilles <span>✦</span> Retrait à la cave du Vieux-Lille<span class="hide-sm">✦</span><span class="hide-sm" style="color:inherit;margin:0">En direct des vignerons</span></div>' +
      '<header class="site-header"><div class="container header-inner">' +
        '<div class="header-left">' +
          '<button class="icon-btn burger" data-open-menu aria-label="Ouvrir le menu">' + I.menu + "</button>" +
          '<nav class="nav" aria-label="Navigation principale">' +
            '<a href="cave.html"' + a("cave") + ">La Cave</a>" +
            '<div class="nav-item"><button class="nav-link" type="button" aria-haspopup="true">Nos vins</button>' + megaHTML() + "</div>" +
            '<a href="index.html#regions"' + a("regions") + ">Régions</a>" +
          "</nav>" +
        "</div>" +
        '<a class="brand" href="index.html" aria-label="Vin des Copains — Accueil">' + V.brandHTML() + "</a>" +
        '<div class="header-right">' +
          '<nav class="nav nav-right" aria-label="Navigation secondaire">' +
            '<a href="index.html#garde">Quand déguster</a>' +
            '<a href="index.html#maison">La Maison</a>' +
          "</nav>" +
          '<button class="icon-btn" data-open-search aria-label="Rechercher">' + I.search + "</button>" +
          '<button class="icon-btn" data-open-cart aria-label="Panier">' + I.bag + '<span class="cart-count">0</span></button>' +
        "</div>" +
      "</div></header>";
  }

  function mobileMenuHTML() {
    var cats = V.CATEGORIES.map(function (c) { return '<a href="cave.html?categorie=' + c.slug + '">' + esc(c.nom) + "</a>"; }).join("");
    var regs = V.REGIONS.map(function (r) { return '<a href="cave.html?region=' + r.slug + '">' + esc(r.nom) + "</a>"; }).join("");
    var cons = V.CONSOMMATIONS.map(function (c) { return '<a href="cave.html?conso=' + c.slug + '">' + esc(c.nom) + "</a>"; }).join("");
    return '<div class="mobile-menu" id="mobile-menu" aria-hidden="true">' +
      '<div class="mobile-menu-top"><div class="brand" style="align-items:flex-start;text-align:left">' + V.brandHTML(false) + '</div><button class="icon-btn" data-close-menu aria-label="Fermer">' + I.close + "</button></div>" +
      "<nav>" +
        '<a href="cave.html">La Cave</a>' +
        '<details><summary>Catégories</summary><div class="sub">' + cats + "</div></details>" +
        '<details><summary>Régions</summary><div class="sub">' + regs + "</div></details>" +
        '<details><summary>Consommation</summary><div class="sub">' + cons + "</div></details>" +
        '<a href="index.html#maison">La Maison</a>' +
      "</nav>" +
      '<div class="m-foot">L\'abus d\'alcool est dangereux pour la santé.<br>À consommer avec modération.</div>' +
    "</div>";
  }

  /* ---------- Coordonnées ---------- */
  var C = V.CONTACT || {};
  V.adresseComplete = function () {
    return [C.adresse, [C.codePostal, C.ville].filter(Boolean).join(" ")].filter(Boolean).join(", ");
  };
  V.telHref = function (n) { return "tel:" + String(n || C.telephone || "").replace(/[^\d+]/g, ""); };
  V.contactLignes = function () {
    var h = "", adr = V.adresseComplete();
    if (adr) h += '<li><a href="https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(adr) + '" target="_blank" rel="noopener">' + esc(C.adresse || "") + (C.adresse ? "<br>" : "") + esc([C.codePostal, C.ville].filter(Boolean).join(" ")) + "</a></li>";
    if (C.telephone) h += '<li><a href="' + V.telHref() + '">' + esc(C.telephone) + "</a></li>";
    if (C.mobile) h += '<li><a href="' + V.telHref(C.mobile) + '">' + esc(C.mobile) + "</a></li>";
    if (C.email) h += '<li><a href="mailto:' + esc(C.email) + '">' + esc(C.email) + "</a></li>";
    (C.horaires || []).forEach(function (l) { h += "<li>" + esc(l[0]) + "<br><span style=\"opacity:.7\">" + esc(l[1]) + "</span></li>"; });
    return h;
  };

  /* ---------- Pied de page ---------- */
  function footerHTML() {
    var cats = V.CATEGORIES.map(function (c) { return '<li><a href="cave.html?categorie=' + c.slug + '">' + esc(c.nom) + "</a></li>"; }).join("");
    var regs = V.REGIONS.slice(0, 8).map(function (r) { return '<li><a href="cave.html?region=' + r.slug + '">' + esc(r.nom) + "</a></li>"; }).join("");
    var year = new Date().getFullYear();
    var contact = V.contactLignes() || '<li><a href="index.html#visite">Nous rendre visite</a></li>';
    return '<footer class="site-footer"><div class="container">' +
      '<div class="footer-top">' +
        '<div class="footer-brand"><a class="brand" href="index.html">' + V.brandHTML() + "</a>" +
          "<p>Une cave de copains, une sélection de passionnés. Des vins choisis un à un, pour le plaisir de les partager autour d'une belle table.</p>" +
          '<div class="socials">' +
            '<a href="' + esc(C.instagram || "#") + '"' + (C.instagram ? ' target="_blank" rel="noopener"' : "") + ' aria-label="Instagram">' + I.instagram + "</a>" +
            '<a href="' + esc(C.facebook || "#") + '"' + (C.facebook ? ' target="_blank" rel="noopener"' : "") + ' aria-label="Facebook">' + I.facebook + "</a>" +
            '<a href="' + (C.email ? "mailto:" + esc(C.email) : "#") + '" aria-label="E-mail">' + I.mail + "</a>" +
          "</div>" +
        "</div>" +
        '<div><h4>La Cave</h4><ul>' + cats + '<li><a href="cave.html">Toute la cave</a></li></ul></div>' +
        '<div><h4>Régions</h4><ul>' + regs + '<li><a href="index.html#regions">Toutes les régions</a></li></ul></div>' +
        '<div><h4>La Maison</h4><ul>' +
          '<li><a href="index.html#maison">Notre histoire</a></li>' +
          '<li><a href="index.html#garde">Quand déguster ?</a></li>' +
          '<li><a href="index.html#club">Le Cercle des Copains</a></li>' +
          '<li><a href="mentions-legales.html">Mentions légales</a></li>' +
          '<li><a href="mentions-legales.html#livraison">Livraison &amp; retrait</a></li>' +
        "</ul></div>" +
        '<div><h4>Nous trouver</h4><ul class="contact-list">' + contact + "</ul></div>" +
      "</div>" +
      '<div class="footer-giant" aria-hidden="true">Vin <em>des</em> Copains</div>' +
      '<div class="footer-bottom"><span>© ' + year + " Vin des Copains" + (C.societe ? " · " + esc(C.societe) : "") + " — Tous droits réservés</span>" +
        '<span class="evin">L\'abus d\'alcool est dangereux pour la santé, à consommer avec modération.</span></div>' +
    "</div></footer>";
  }

  /* ---------- Panier ---------- */
  var cart = store.get("vdc-panier", {});
  function cartCount() { var n = 0; for (var k in cart) n += cart[k]; return n; }
  function cartTotal() { var t = 0; for (var k in cart) { var p = V.produit(k); if (p) t += p.prix * cart[k]; } return t; }
  function saveCart() {
    for (var k in cart) if (!V.produit(k) || cart[k] <= 0) delete cart[k];
    store.set("vdc-panier", cart);
    renderCart();
  }
  function drawerHTML() {
    return '<div class="overlay" data-overlay></div>' +
      '<aside class="drawer" id="cart-drawer" aria-label="Panier" aria-hidden="true">' +
        '<div class="drawer-head"><h3>Votre panier<small data-cart-n></small></h3><button class="icon-btn" data-close-cart aria-label="Fermer">' + I.close + "</button></div>" +
        '<div class="drawer-body" data-cart-body></div>' +
        '<div class="drawer-foot" data-cart-foot></div>' +
      "</aside>" +
      '<div class="search-panel" id="search-panel" aria-hidden="true"><div class="container">' +
        '<div class="search-top"><span class="eyebrow">Rechercher un vin</span><button class="icon-btn" data-close-search aria-label="Fermer">' + I.close + "</button></div>" +
        '<label class="search-field">' + I.search + '<input type="search" placeholder="Un nom, une région, une couleur…" data-search-input autocomplete="off"></label>' +
        '<div class="search-suggest"><span>Suggestions</span>' +
          V.CATEGORIES.map(function (c) { return '<a class="chip" href="cave.html?categorie=' + c.slug + '">' + esc(c.nom) + "</a>"; }).join("") +
        "</div>" +
        '<div class="search-results" data-search-results></div>' +
      "</div></div>" +
      '<div class="toast" data-toast role="status" aria-live="polite"></div>';
  }
  function renderCart() {
    var n = cartCount();
    document.querySelectorAll(".cart-count").forEach(function (el) { el.textContent = n; el.classList.toggle("show", n > 0); });
    var body = document.querySelector("[data-cart-body]"), foot = document.querySelector("[data-cart-foot]"), cn = document.querySelector("[data-cart-n]");
    if (!body) return;
    cn.textContent = n ? "(" + n + ")" : "";
    var ids = Object.keys(cart);
    if (!ids.length) {
      body.innerHTML = '<div class="cart-empty">' + I.glass + "<p>Votre panier est vide</p><small>Laissez-vous guider par nos sélections.</small>" +
        '<a class="btn btn-dark" href="cave.html">Découvrir la cave ' + I.arrow + "</a></div>";
      foot.style.display = "none";
      return;
    }
    foot.style.display = "";
    body.innerHTML = ids.map(function (id) {
      var p = V.produit(id), r = V.region(p.region);
      return '<div class="cart-line"><a class="cart-thumb" href="produit.html?id=' + encodeURIComponent(id) + '">' + V.visuel(p) + "</a>" +
        '<div><span class="r">' + esc(r ? r.nom : "") + "</span><h4>" + esc(p.nom) + "</h4>" +
        '<div class="qty"><button data-dec="' + esc(id) + '" aria-label="Retirer une bouteille">−</button><span>' + cart[id] + '</span><button data-inc="' + esc(id) + '" aria-label="Ajouter une bouteille">+</button></div></div>' +
        '<div class="right"><span class="p">' + V.prix(p.prix * cart[id]) + '</span><button class="rm" data-rm="' + esc(id) + '">Retirer</button></div></div>';
    }).join("");
    var L = (V.CONTACT || {}).livraison || {}, seuil = L.offerteDes || 12, reste = Math.max(0, seuil - n);
    foot.innerHTML = '<div class="free-ship">' + (reste ? "Plus que <strong>" + V.pluriel(reste, "bouteille") + "</strong> pour profiter de la livraison offerte" : "<strong>Livraison offerte</strong> : bravo, votre carton est complet !") +
        '<div class="bar"><i style="width:' + Math.min(100, (n / seuil) * 100) + '%"></i></div></div>' +
      '<div class="totals"><span>Sous-total</span><strong>' + V.prix(cartTotal()) + "</strong></div>" +
      '<p class="note">' + (reste ? "Livraison " + esc(L.transporteur || "") + " : " + V.prix(L.prix || 0) + " (colis de 3, 6 ou 9 bouteilles). " : "") + "Retrait possible à la cave sur rendez-vous.</p>" +
      '<button class="btn btn-wine btn-block" data-checkout>Valider ma commande ' + I.arrow + "</button>";
  }
  V.ajouter = function (id, q) {
    var p = V.produit(id);
    if (!p) return;
    cart[id] = (cart[id] || 0) + (q || 1);
    saveCart();
    document.querySelectorAll(".cart-count").forEach(function (el) { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); });
    toast('<span class="t-thumb">' + V.visuel(p) + '</span><span class="t-txt"><strong>' + esc(p.nom) + "</strong>Ajouté à votre panier</span>" +
      '<button data-open-cart>Voir</button>');
  };

  var toastTimer;
  function toast(html) {
    var t = document.querySelector("[data-toast]");
    if (!t) return;
    t.innerHTML = html;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 3400);
  }
  V.toast = toast;

  /* ---------- Panneaux (panier, recherche, menu) ---------- */
  function openPanel(sel) {
    closePanels();
    var el = document.querySelector(sel);
    if (!el) return;
    el.classList.add("open");
    el.setAttribute("aria-hidden", "false");
    document.querySelector("[data-overlay]").classList.add("show");
    document.body.classList.add("no-scroll");
    if (sel === "#search-panel") setTimeout(function () { var i = el.querySelector("input"); if (i) i.focus(); }, 300);
  }
  function closePanels() {
    document.querySelectorAll(".drawer.open, .search-panel.open, .mobile-menu.open, .filters.open").forEach(function (el) {
      el.classList.remove("open");
      el.setAttribute("aria-hidden", "true");
    });
    var o = document.querySelector("[data-overlay]");
    if (o) o.classList.remove("show");
    document.body.classList.remove("no-scroll");
  }
  V.openPanel = openPanel;
  V.closePanels = closePanels;

  function runSearch(q) {
    var box = document.querySelector("[data-search-results]");
    q = (q || "").trim().toLowerCase();
    if (!q) { box.innerHTML = ""; return; }
    var norm = function (s) { return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); };
    var nq = norm(q);
    var res = V.PRODUITS.filter(function (p) {
      var r = V.region(p.region), hay = p.nom + " " + (r ? r.nom : "") + " " + (p.categories || []).map(function (c) { var x = V.categorie(c); return x ? x.nom : ""; }).join(" ");
      return norm(hay).indexOf(nq) > -1;
    });
    box.innerHTML = res.length
      ? res.slice(0, 8).map(V.carte).join("")
      : '<p style="grid-column:1/-1;font-family:var(--serif);font-size:1.4rem;color:var(--muted)">' +
        (V.PRODUITS.length ? "Aucun vin ne correspond à « " + esc(q) + " »." : "Notre cave se remplit : les bouteilles arrivent très bientôt.") + "</p>";
  }

  /* ---------- Contrôle d'âge ---------- */
  function ageGate() {
    if (store.get("vdc-age-ok", false)) return;
    var g = document.createElement("div");
    g.className = "age-gate";
    g.setAttribute("role", "dialog");
    g.setAttribute("aria-modal", "true");
    g.innerHTML = '<div class="age-gate-box"><div class="brand">' + V.brandHTML() + "</div>" +
      "<h2>Bienvenue <em>chez les copains</em></h2>" +
      "<p>Pour entrer sur notre site, vous devez avoir l'âge légal pour consommer de l'alcool dans votre pays de résidence.</p>" +
      '<div class="actions"><button class="btn btn-light" data-age-yes>J\'ai plus de 18 ans</button><button class="btn btn-ghost-light" data-age-no>J\'ai moins de 18 ans</button></div>' +
      '<div class="refused" data-age-refused>Revenez nous voir un peu plus tard… à bientôt !</div>' +
      "<small>L'abus d'alcool est dangereux pour la santé, à consommer avec modération.</small></div>";
    document.body.appendChild(g);
    document.body.classList.add("no-scroll");
    g.querySelector("[data-age-yes]").addEventListener("click", function () {
      store.set("vdc-age-ok", true);
      g.classList.add("hide");
      document.body.classList.remove("no-scroll");
      setTimeout(function () { g.remove(); }, 1000);
    });
    g.querySelector("[data-age-no]").addEventListener("click", function () {
      g.querySelector("[data-age-refused]").style.display = "block";
    });
  }

  /* ---------- Animations ---------- */
  V.observe = function (root) {
    var els = (root || document).querySelectorAll(".reveal:not(.in), .img-reveal:not(.in)");
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    els.forEach(function (e) { io.observe(e); });
  };

  /* ---------- Initialisation ---------- */
  function init() {
    var top = document.getElementById("site-top");
    if (top) top.innerHTML = headerHTML(document.body.getAttribute("data-page"));
    document.body.insertAdjacentHTML("beforeend", mobileMenuHTML() + drawerHTML());
    var foot = document.getElementById("site-footer");
    if (foot) foot.outerHTML = footerHTML();

    // Hauteur de la barre d'annonce (pour la masquer au défilement)
    var ann = document.querySelector(".announce");
    var setAnn = function () { if (ann) document.documentElement.style.setProperty("--announce-h", ann.offsetHeight + "px"); };
    setAnn();
    window.addEventListener("resize", setAnn);

    var onScroll = function () {
      var y = window.scrollY;
      if (top) top.classList.toggle("scrolled", y > 30);
      document.querySelectorAll("[data-parallax]").forEach(function (el) {
        var r = el.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        var k = parseFloat(el.getAttribute("data-parallax")) || 0.15;
        el.style.transform = "translate3d(0," + ((r.top + r.height / 2 - window.innerHeight / 2) * -k).toFixed(1) + "px,0)";
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    document.addEventListener("click", function (e) {
      var t = e.target.closest("[data-add],[data-open-cart],[data-close-cart],[data-open-search],[data-close-search],[data-open-menu],[data-close-menu],[data-overlay],[data-inc],[data-dec],[data-rm],[data-checkout]");
      if (!t) return;
      if (t.hasAttribute("data-add")) { e.preventDefault(); V.ajouter(t.getAttribute("data-add")); }
      else if (t.hasAttribute("data-open-cart")) { openPanel("#cart-drawer"); }
      else if (t.hasAttribute("data-open-search")) { openPanel("#search-panel"); }
      else if (t.hasAttribute("data-open-menu")) { openPanel("#mobile-menu"); }
      else if (t.matches("[data-close-cart],[data-close-search],[data-close-menu],[data-overlay]")) { closePanels(); }
      else if (t.hasAttribute("data-inc")) { cart[t.getAttribute("data-inc")]++; saveCart(); }
      else if (t.hasAttribute("data-dec")) { cart[t.getAttribute("data-dec")]--; saveCart(); }
      else if (t.hasAttribute("data-rm")) { delete cart[t.getAttribute("data-rm")]; saveCart(); }
      else if (t.hasAttribute("data-checkout")) {
        document.querySelector("[data-cart-body]").innerHTML = '<div class="cart-empty">' + I.lock +
          "<p>Merci pour votre sélection !</p><small>Le paiement sécurisé sera activé à la mise en ligne du site.<br>Votre panier reste enregistré.</small>" +
          '<button class="btn btn-ghost" data-close-cart>Continuer mes achats</button></div>';
        document.querySelector("[data-cart-foot]").style.display = "none";
      }
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closePanels(); });
    var si = document.querySelector("[data-search-input]");
    if (si) si.addEventListener("input", function () { runSearch(si.value); });
    document.querySelectorAll("#mobile-menu a").forEach(function (a) { a.addEventListener("click", closePanels); });

    renderCart();
    ageGate();
    V.observe();
  }

  // Les scripts sont chargés en fin de page : le DOM est déjà prêt.
  init();
})();
