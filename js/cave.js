/* ==========================================================================
   VIN DES COPAINS — Page « La Cave » (catalogue filtrable)
   ========================================================================== */
(function () {
  "use strict";
  var V = window.VDC, esc = V.esc;
  var $ = function (s) { return document.querySelector(s); };

  var prixMax = Math.ceil(Math.max.apply(null, V.PRODUITS.map(function (p) { return p.prix; }).concat([10])) / 5) * 5;
  var params = new URLSearchParams(location.search);
  var list = function (k) { var v = params.get(k); return v ? v.split(",").filter(Boolean) : []; };

  var state = {
    categorie: list("categorie"),
    region: list("region"),
    conso: list("conso"),
    max: params.get("max") ? +params.get("max") : prixMax,
    q: params.get("q") || "",
    sort: params.get("tri") || "selection",
    limit: 24
  };
  var PAGE = 24;

  var FACETS = {
    categorie: { items: V.CATEGORIES, test: function (p, s) { return (p.categories || []).indexOf(s) > -1; } },
    region:    { items: V.REGIONS,    test: function (p, s) { return p.region === s; } },
    conso:     { items: V.CONSOMMATIONS, test: function (p, s) { return p.consommation === s; } }
  };

  var norm = function (s) { return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); };

  function match(p, skip) {
    for (var k in FACETS) {
      if (k === skip || !state[k].length) continue;
      var ok = state[k].some(function (s) { return FACETS[k].test(p, s); });
      if (!ok) return false;
    }
    if (p.prix > state.max) return false;
    if (state.q) {
      var r = V.region(p.region);
      if (norm(p.nom + " " + (r ? r.nom : "")).indexOf(norm(state.q)) < 0) return false;
    }
    return true;
  }

  function results() {
    var res = V.PRODUITS.filter(function (p) { return match(p); });
    var s = state.sort;
    if (s === "prix-asc") res.sort(function (a, b) { return a.prix - b.prix; });
    else if (s === "prix-desc") res.sort(function (a, b) { return b.prix - a.prix; });
    else if (s === "nom") res.sort(function (a, b) { return a.nom.localeCompare(b.nom, "fr"); });
    return res;
  }

  /* ---------- Rendu des filtres ---------- */
  function renderFacets() {
    Object.keys(FACETS).forEach(function (k) {
      var box = document.querySelector('[data-f="' + k + '"]');
      box.innerHTML = FACETS[k].items.map(function (it) {
        var n = V.PRODUITS.filter(function (p) { return match(p, k) && FACETS[k].test(p, it.slug); }).length;
        var on = state[k].indexOf(it.slug) > -1;
        return '<label class="check' + (!n && !on ? " disabled" : "") + '"><input type="checkbox" data-k="' + k + '" value="' + it.slug + '"' + (on ? " checked" : "") + '><span class="box"></span><span class="lbl">' + esc(it.nom) + '</span><span class="n">' + n + "</span></label>";
      }).join("");
    });
  }

  function renderPills() {
    var total = V.PRODUITS.length;
    var h = '<button class="cat-pill' + (!state.categorie.length ? " active" : "") + '" data-pill="">Tous les vins<sup>' + total + "</sup></button>";
    h += V.CATEGORIES.map(function (c) {
      var n = V.PRODUITS.filter(function (p) { return (p.categories || []).indexOf(c.slug) > -1; }).length;
      var on = state.categorie.length === 1 && state.categorie[0] === c.slug;
      return '<button class="cat-pill' + (on ? " active" : "") + '" data-pill="' + c.slug + '">' + esc(c.nom) + "<sup>" + n + "</sup></button>";
    }).join("");
    $("[data-cat-pills]").innerHTML = h;
  }

  function renderChips() {
    var h = "";
    Object.keys(FACETS).forEach(function (k) {
      state[k].forEach(function (s) {
        var it = FACETS[k].items.filter(function (x) { return x.slug === s; })[0];
        if (it) h += '<button class="chip" data-chip-k="' + k + '" data-chip-v="' + s + '">' + esc(it.nom) + ' <span class="x">×</span></button>';
      });
    });
    if (state.max < prixMax) h += '<button class="chip" data-chip-k="max">Jusqu\'à ' + V.prix(state.max) + ' <span class="x">×</span></button>';
    if (state.q) h += '<button class="chip" data-chip-k="q">« ' + esc(state.q) + ' » <span class="x">×</span></button>';
    $("[data-chips]").innerHTML = h;
  }

  function renderHero() {
    var title = "La <em>Cave</em>", lead = "Toute notre sélection, à explorer par région, par couleur ou selon le moment où vous souhaitez la déguster.", img = "assets/img/cave-murale.jpg", extra = "";
    var only = function (k) { return state[k].length === 1 && Object.keys(FACETS).every(function (o) { return o === k || !state[o].length; }); };
    if (only("categorie")) {
      var c = V.categorie(state.categorie[0]);
      if (c) { title = esc(c.nom).replace(/^(\S+)\s(.+)$/, "$1 <em>$2</em>"); lead = esc(c.note); img = c.image; extra = c.nom; }
    } else if (only("region")) {
      var r = V.region(state.region[0]);
      if (r) { title = esc(r.nom); lead = esc(r.note); img = "assets/img/vignoble.jpg"; extra = r.nom; }
    } else if (only("conso")) {
      var co = V.conso(state.conso[0]);
      if (co) { title = esc(co.nom); lead = esc(co.note); img = "assets/img/chai.jpg"; extra = co.nom; }
    }
    $("[data-hero-title]").innerHTML = title;
    $("[data-hero-lead]").innerHTML = lead;
    $("[data-crumb-extra]").innerHTML = extra ? "/ " + esc(extra) : "";
    var hi = $("[data-hero-img]");
    if (hi.getAttribute("src") !== img) hi.src = img;
    document.title = (extra ? extra + " — " : "La Cave — ") + "Vin des Copains";
  }

  function renderGrid() {
    var res = results(), grid = $("[data-grid]");
    $("[data-count]").innerHTML = "<em>" + res.length + "</em> " + (res.length > 1 ? "vins" : "vin");
    if (!res.length) {
      grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1">' + V.icons.glass +
        "<h3>Aucun vin pour le moment</h3><p>Cette sélection est en cours de préparation. Élargissez votre recherche&nbsp;!</p>" +
        '<button class="btn btn-dark" data-reset>Voir toute la cave</button></div>';
      return;
    }
    grid.innerHTML = res.slice(0, state.limit).map(V.carte).join("");
    var more = $("[data-more]");
    if (res.length > state.limit) {
      more.innerHTML = "<p>Vous avez vu " + state.limit + " vins sur " + res.length + '</p><div class="bar"><i style="width:' + (state.limit / res.length * 100) + '%"></i></div>' +
        '<button class="btn btn-ghost" data-load-more>Afficher plus de vins</button>';
    } else more.innerHTML = "";
  }

  function syncURL() {
    var p = new URLSearchParams();
    ["categorie", "region", "conso"].forEach(function (k) { if (state[k].length) p.set(k, state[k].join(",")); });
    if (state.max < prixMax) p.set("max", state.max);
    if (state.q) p.set("q", state.q);
    if (state.sort !== "selection") p.set("tri", state.sort);
    var qs = p.toString();
    try { history.replaceState(null, "", location.pathname + (qs ? "?" + qs : "")); } catch (e) {}
  }

  function renderPrice() {
    var r = $("[data-price]");
    r.max = prixMax;
    r.value = state.max;
    $("[data-price-val]").textContent = V.prix(state.max);
    $("[data-price-min]").textContent = V.prix(0);
  }

  function render() {
    state.limit = PAGE;
    renderPills(); renderFacets(); renderChips(); renderHero(); renderGrid(); renderPrice(); syncURL();
  }

  /* ---------- Événements ---------- */
  document.addEventListener("change", function (e) {
    var t = e.target;
    if (t.matches("[data-k]")) {
      var k = t.getAttribute("data-k"), v = t.value, arr = state[k];
      var i = arr.indexOf(v);
      if (t.checked && i < 0) arr.push(v);
      if (!t.checked && i > -1) arr.splice(i, 1);
      render();
    } else if (t.matches("[data-sort]")) {
      state.sort = t.value; render();
    }
  });
  $("[data-price]").addEventListener("input", function (e) {
    state.max = +e.target.value; state.limit = PAGE;
    $("[data-price-val]").textContent = V.prix(state.max);
    renderGrid(); renderFacets(); renderChips(); syncURL();
  });
  var qi = $("[data-q]");
  qi.value = state.q;
  qi.addEventListener("input", function () { state.q = qi.value.trim(); state.limit = PAGE; renderGrid(); renderFacets(); renderChips(); syncURL(); });
  $("[data-sort]").value = state.sort;

  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-pill],[data-chip-k],[data-reset],[data-open-filters],[data-close-filters],[data-load-more]");
    if (!t) return;
    if (t.hasAttribute("data-load-more")) {
      state.limit += PAGE; renderGrid();
    } else if (t.hasAttribute("data-pill")) {
      var v = t.getAttribute("data-pill");
      state.categorie = v ? [v] : [];
      render();
      var top = document.querySelector(".shop").getBoundingClientRect().top + window.scrollY - 150;
      if (window.scrollY > top) window.scrollTo({ top: top, behavior: "smooth" });
    } else if (t.hasAttribute("data-chip-k")) {
      var k = t.getAttribute("data-chip-k");
      if (k === "max") state.max = prixMax;
      else if (k === "q") { state.q = ""; qi.value = ""; }
      else state[k].splice(state[k].indexOf(t.getAttribute("data-chip-v")), 1);
      render();
    } else if (t.hasAttribute("data-reset")) {
      state.categorie = []; state.region = []; state.conso = []; state.max = prixMax; state.q = ""; qi.value = "";
      render();
      V.closePanels();
    } else if (t.hasAttribute("data-open-filters")) {
      V.closePanels();
      $("#filters").classList.add("open");
      document.querySelector("[data-overlay]").classList.add("show");
      document.body.classList.add("no-scroll");
    } else if (t.hasAttribute("data-close-filters")) {
      V.closePanels();
    }
  });

  render();
})();
