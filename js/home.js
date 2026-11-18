/* ==========================================================================
   VIN DES COPAINS — Page d'accueil
   ========================================================================== */
(function () {
  "use strict";
  var V = window.VDC, I = V.icons, esc = V.esc;
  var $ = function (s) { return document.querySelector(s); };
  var count = function (fn) { return V.PRODUITS.filter(fn).length; };

  // Emblème au centre du badge tournant
  var core = $("[data-mark]");
  if (core) core.innerHTML = V.mark;

  // Chiffres du héros
  var sr = $('[data-stat="regions"]'), sv = $('[data-stat="vins"]');
  if (sr) sr.textContent = V.REGIONS.length;
  if (sv) sv.textContent = V.PRODUITS.length;

  // Défilant des régions (doublé pour une boucle continue)
  var mq = $("[data-marquee]");
  if (mq) {
    var line = V.REGIONS.map(function (r) { return '<a href="cave.html?region=' + r.slug + '">' + esc(r.nom) + "</a>"; }).join("");
    mq.innerHTML = line + line;
  }

  // Univers / catégories
  var uv = $("[data-univers]");
  if (uv) {
    uv.innerHTML = V.CATEGORIES.map(function (c, i) {
      var n = count(function (p) { return (p.categories || []).indexOf(c.slug) > -1; });
      return '<a class="univers-card reveal reveal-d' + (i % 4 + 1) + '" href="cave.html?categorie=' + c.slug + '">' +
        '<img src="' + c.image + '" alt="" loading="lazy">' +
        '<span class="num">0' + (i + 1) + "</span>" +
        "<h3>" + esc(c.nom) + "</h3><p>" + esc(c.note) + "</p>" +
        '<span class="meta"><span>' + (n ? V.pluriel(n, "référence") : "Découvrir") + "</span>" + I.arrow + "</span></a>";
    }).join("");
  }

  // Sélection du moment (bouteilles marquées « selection: true », sinon les premières)
  var car = $("[data-carousel]");
  if (car) {
    var sel = V.PRODUITS.filter(function (p) { return p.selection; });
    if (!sel.length) sel = V.PRODUITS.slice(0, 10);
    car.innerHTML = sel.map(V.carte).join("");
    var prog = $("[data-car-progress]");
    var step = function (dir) {
      var card = car.firstElementChild;
      if (!card) return;
      car.scrollBy({ left: dir * (card.getBoundingClientRect().width + 24), behavior: "smooth" });
    };
    $("[data-car-prev]").addEventListener("click", function () { step(-1); });
    $("[data-car-next]").addEventListener("click", function () { step(1); });
    var upd = function () {
      var max = car.scrollWidth - car.clientWidth, ratio = car.clientWidth / car.scrollWidth;
      prog.style.width = Math.min(100, ratio * 100) + "%";
      prog.style.transform = "translateX(" + (max > 0 ? (car.scrollLeft / max) * ((1 / ratio) - 1) * 100 : 0) + "%)";
    };
    car.addEventListener("scroll", upd, { passive: true });
    window.addEventListener("resize", upd);
    upd();
  }

  // Frise de consommation
  var tl = $("[data-timeline]");
  if (tl) {
    tl.innerHTML = V.CONSOMMATIONS.map(function (c, i) {
      var n = count(function (p) { return p.consommation === c.slug; });
      return '<li class="reveal reveal-d' + (i + 1) + '"><a href="cave.html?conso=' + c.slug + '">' +
        '<span class="dot"><i></i></span>' +
        '<div><span class="when">' + esc(c.horizon) + "</span><h3>" + esc(c.nom) + "</h3><p>" + esc(c.note) + "</p></div>" +
        '<span class="count">' + (n ? V.pluriel(n, "vin") : "Voir") + " →</span></a></li>";
    }).join("");
  }

  // Régions
  var rl = $("[data-regions]");
  if (rl) {
    var imgs = ["assets/img/vignoble.jpg", "assets/img/vignoble-2.jpg", "assets/img/raisin-blanc.jpg", "assets/img/chai.jpg", "assets/img/degustation.jpg", "assets/img/cave-murale.jpg"];
    rl.innerHTML = V.REGIONS.map(function (r, i) {
      var n = count(function (p) { return p.region === r.slug; });
      return '<li class="reveal"><a href="cave.html?region=' + r.slug + '" data-rv="' + i + '">' +
        '<span class="idx">' + (i < 9 ? "0" : "") + (i + 1) + "</span>" +
        '<span class="nm">' + esc(r.nom) + "</span>" +
        '<span class="ct">' + (n ? V.pluriel(n, "vin") : "") + "</span></a></li>";
    }).join("");
    var rvImg = $("[data-rv-img]"), rvT = $("[data-rv-title]"), rvN = $("[data-rv-note]"), last = -1;
    rl.addEventListener("mouseover", function (e) {
      var a = e.target.closest("[data-rv]");
      if (!a) return;
      var i = +a.getAttribute("data-rv");
      if (i === last) return;
      last = i;
      rl.querySelectorAll("a.active").forEach(function (x) { x.classList.remove("active"); });
      a.classList.add("active");
      var r = V.REGIONS[i];
      rvT.textContent = r.nom;
      rvN.textContent = r.note;
      var src = imgs[i % imgs.length];
      if (rvImg.getAttribute("src") !== src) {
        rvImg.style.opacity = 0;
        setTimeout(function () { rvImg.src = src; rvImg.style.opacity = 1; }, 250);
      }
    });
  }

  // Services
  var sv = $("[data-services]");
  if (sv) {
    var L = (V.CONTACT || {}).livraison || {};
    var S = [
      [I.box, "Livraison soignée", "Cartons sécurisés de 3, 6 ou 12 bouteilles, livrés par " + (L.transporteur || "Colissimo") + " sous " + (L.delai || "2 à 3 jours") + ". Offerte dès " + (L.offerteDes || 12) + " bouteilles."],
      [I.cellar, "Retrait à la cave", "Venez chercher votre commande au Vieux-Lille, sur rendez-vous : on la charge directement dans votre coffre."],
      [I.glass, "Ateliers de dégustation", "Découvrez nos vignerons et nos dernières trouvailles lors de nos ateliers à la cave."],
      [I.chat, "Conseils de copains", "Un repas, un cadeau, une envie : contactez-nous, on vous aide à choisir la bonne bouteille."]
    ];
    sv.innerHTML = S.map(function (s, i) {
      return '<div class="service reveal reveal-d' + (i + 1) + '">' + s[0] + "<h3>" + s[1] + "</h3><p>" + s[2] + "</p></div>";
    }).join("");
  }

  // Nous rendre visite
  var C = V.CONTACT || {}, vi = $("[data-visit-infos]"), vm = $("[data-visit-map]");
  if (vi) {
    var adr = V.adresseComplete(), rows = [];
    rows.push(["Adresse", adr ? esc(C.adresse || "") + (C.adresse ? "<br>" : "") + esc([C.codePostal, C.ville].filter(Boolean).join(" ")) : '<span class="ph">Adresse de la boutique</span>']);
    rows.push(["Téléphone", C.telephone || C.mobile ? [C.telephone, C.mobile].filter(Boolean).map(function (t) { return '<a href="' + V.telHref(t) + '">' + esc(t) + "</a>"; }).join("<br>") : '<span class="ph">Numéro de téléphone</span>']);
    rows.push(["E-mail", C.email ? '<a href="mailto:' + esc(C.email) + '">' + esc(C.email) + "</a>" : '<span class="ph">Adresse e-mail</span>']);
    rows.push(["Horaires", (C.horaires && C.horaires.length) ? C.horaires.map(function (h) { return esc(h[0]) + "<br>" + esc(h[1]); }).join("<br>") + (C.noteHoraires ? '<small class="visit-note">' + esc(C.noteHoraires) + "</small>" : "") : '<span class="ph">Horaires d\'ouverture</span>']);
    vi.innerHTML = rows.map(function (r) { return "<div><dt>" + r[0] + "</dt><dd>" + r[1] + "</dd></div>"; }).join("");
  }
  if (vm) {
    var a2 = V.adresseComplete();
    vm.innerHTML = a2
      ? '<iframe title="Plan d\'accès" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=' + encodeURIComponent(a2) + '&z=16&output=embed"></iframe>' +
        '<a class="btn btn-dark visit-cta" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(a2) + '">Itinéraire ' + I.arrow + "</a>"
      : '<img src="assets/img/degustation.jpg" alt="Verres de vin posés sur un fût" loading="lazy">';
  }

  // Inscription au Cercle
  var cf = $("[data-club-form]");
  if (cf) cf.addEventListener("submit", function (e) {
    e.preventDefault();
    cf.innerHTML = '<p style="font-family:var(--serif);font-size:1.5rem;font-style:italic;margin:14px 0;color:var(--gold-soft)">Bienvenue dans le Cercle des Copains !</p>';
  });

  V.observe();
})();
