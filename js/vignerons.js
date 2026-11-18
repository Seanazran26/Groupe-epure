/* ==========================================================================
   VIN DES COPAINS — Page « Nos vignerons » (carte de France interactive)
   ========================================================================== */
(function () {
  "use strict";
  var V = window.VDC, esc = V.esc, M = V.CARTE, P = M.proj;
  var $ = function (s) { return document.querySelector(s); };
  var LISTE = V.VIGNERONS || [], VIGNOBLES = V.VIGNOBLES || [];

  /* ---------- Projection (identique à celle du fond de carte) ---------- */
  function project(lon, lat) {
    var r = Math.PI / 180;
    var rho = P.F / Math.pow(Math.tan(Math.PI / 4 + (lat * r) / 2), P.n);
    var t = P.n * (lon - P.l0) * r;
    return [rho * Math.sin(t) * P.k + P.tx, -(P.rho0 - rho * Math.cos(t)) * P.k + P.ty];
  }

  var VILLES = [
    { nom: "Paris", lon: 2.3522, lat: 48.8566 },
    { nom: "Lyon", lon: 4.8357, lat: 45.764 },
    { nom: "Bordeaux", lon: -0.5792, lat: 44.8378 },
    { nom: "Marseille", lon: 5.3698, lat: 43.2965 }
  ];
  var CAVE = { nom: "Notre cave · Lille", lon: 3.0613, lat: 50.6405 };

  var svg = $("[data-vg-map]"), wrap = $("[data-vg-wrap]"), tip = $("[data-vg-tip]");
  var FULL = [0, 0, M.w, M.h], view = FULL.slice();
  var state = { filtre: "", sel: -1 };

  /* ---------- Construction de la carte ---------- */
  var pts = LISTE.map(function (v) { return project(v.lon, v.lat); });
  var h = '<path class="vg-voisins" d="' + M.voisins + '" vector-effect="non-scaling-stroke"/>' +
    '<path class="vg-france" d="' + M.france + '" vector-effect="non-scaling-stroke"/>' +
    '<g class="vg-cities">';
  VILLES.forEach(function (c) {
    var p = project(c.lon, c.lat);
    h += '<g class="vg-city" data-x="' + p[0] + '" data-y="' + p[1] + '"><circle cx="' + p[0] + '" cy="' + p[1] + '" vector-effect="non-scaling-stroke"/><text x="' + p[0] + '" y="' + p[1] + '">' + esc(c.nom) + "</text></g>";
  });
  var pc = project(CAVE.lon, CAVE.lat);
  h += '<g class="vg-cave" data-x="' + pc[0] + '" data-y="' + pc[1] + '"><path d=""/><text x="' + pc[0] + '" y="' + pc[1] + '">' + esc(CAVE.nom) + "</text></g>";
  h += '</g><g class="vg-points">';
  LISTE.forEach(function (v, i) {
    var p = pts[i];
    h += '<g class="vg-pt" data-i="' + i + '"><circle class="halo" cx="' + p[0] + '" cy="' + p[1] + '"/><circle class="dot" cx="' + p[0] + '" cy="' + p[1] + '" vector-effect="non-scaling-stroke"/></g>';
  });
  svg.innerHTML = h + "</g>";
  svg.setAttribute("viewBox", FULL.join(" "));
  svg.style.aspectRatio = M.w + " / " + M.h;
  var gPts = svg.querySelectorAll(".vg-pt");

  /* ---------- Taille constante des repères quel que soit le zoom ---------- */
  function draw(v) {
    view = v;
    svg.setAttribute("viewBox", v.map(function (n) { return n.toFixed(2); }).join(" "));
    var z = M.w / v[2];
    gPts.forEach(function (g) {
      g.children[0].setAttribute("r", 15 / z);
      g.children[1].setAttribute("r", 6.5 / z);
    });
    svg.querySelectorAll(".vg-city").forEach(function (g) {
      var x = +g.getAttribute("data-x"), y = +g.getAttribute("data-y");
      g.children[0].setAttribute("r", 3.2 / z);
      var t = g.children[1];
      t.setAttribute("font-size", 15 / z);
      t.setAttribute("x", x + 10 / z);
      t.setAttribute("y", y + 5 / z);
    });
    var cv = svg.querySelector(".vg-cave"), cx = +cv.getAttribute("data-x"), cy = +cv.getAttribute("data-y"), s = 8 / z;
    cv.children[0].setAttribute("d", "M" + cx + " " + (cy - s) + "L" + (cx + s) + " " + cy + "L" + cx + " " + (cy + s) + "L" + (cx - s) + " " + cy + "Z");
    cv.children[1].setAttribute("font-size", 19 / z);
    cv.children[1].setAttribute("x", cx + 14 / z);
    cv.children[1].setAttribute("y", cy + 6 / z);
  }

  var anim;
  function zoomTo(target) {
    cancelAnimationFrame(anim);
    var from = view.slice(), t0 = performance.now(), D = 750;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { draw(target); return; }
    (function step(now) {
      var k = Math.min(1, (now - t0) / D), e = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      draw(from.map(function (a, i) { return a + (target[i] - a) * e; }));
      if (k < 1) anim = requestAnimationFrame(step);
    })(t0);
  }

  function cadre(indices) {
    if (!indices.length) return FULL.slice();
    var xs = indices.map(function (i) { return pts[i][0]; }), ys = indices.map(function (i) { return pts[i][1]; });
    var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
    var cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, ratio = M.w / M.h;
    var w = Math.max((x1 - x0) * 1.6, (y1 - y0) * 1.6 * ratio, 220), hh = w / ratio;
    return [cx - w / 2, cy - hh / 2, w, hh];
  }

  /* ---------- Panneau : filtres, fiche, liste ---------- */
  var deux = function (n) { return (n < 10 ? "0" : "") + n; };
  var indicesDe = function (nom) { var r = []; LISTE.forEach(function (v, i) { if (!nom || v.vignoble === nom) r.push(i); }); return r; };
  var vignoble = function (nom) { for (var i = 0; i < VIGNOBLES.length; i++) if (VIGNOBLES[i].nom === nom) return VIGNOBLES[i]; return null; };
  var lienVins = function (vg) {
    return vg && vg.region ? '<a class="link-line" href="nos-vins.html?region=' + vg.region + '">Voir les vins · ' + esc(vg.nom) + ' ' + V.icons.arrow + "</a>" : "";
  };

  $("[data-vg-stats]").innerHTML =
    "<div><strong>" + LISTE.length + "</strong><span>Vignerons</span></div>" +
    "<div><strong>" + VIGNOBLES.length + "</strong><span>Vignobles</span></div>" +
    "<div><strong>1</strong><span>Seul critère</span></div>";

  function renderChips() {
    var h = '<button class="chip' + (!state.filtre ? " active" : "") + '" role="tab" aria-selected="' + !state.filtre + '" data-vg-f="">Toute la France</button>';
    VIGNOBLES.forEach(function (vg) {
      var on = state.filtre === vg.nom;
      h += '<button class="chip' + (on ? " active" : "") + '" role="tab" aria-selected="' + on + '" data-vg-f="' + esc(vg.nom) + '">' + esc(vg.nom) + " <sup>" + indicesDe(vg.nom).length + "</sup></button>";
    });
    $("[data-vg-chips]").innerHTML = h;
  }

  function renderCard() {
    var c = $("[data-vg-card]");
    if (state.sel > -1) {
      var v = LISTE[state.sel];
      c.innerHTML = '<span class="eyebrow">' + esc(v.vignoble) + "</span>" +
        '<h3 class="vg-name">' + esc(v.nom) + "</h3>" +
        (v.note ? '<p class="vg-note">« ' + esc(v.note) + " »</p>" : '<p class="vg-note muted">Un domaine de notre sélection, choisi selon notre seul critère : « Ah, c\'est bon ça ! »</p>') +
        lienVins(vignoble(v.vignoble));
    } else if (state.filtre) {
      var n = indicesDe(state.filtre).length;
      c.innerHTML = '<span class="eyebrow">Vignoble</span><h3 class="vg-name">' + esc(state.filtre) + "</h3>" +
        '<p class="vg-note muted">' + V.pluriel(n, "vigneron") + " de notre sélection. Cliquez sur un point ou un nom pour lire notre mot sur le domaine.</p>" +
        lienVins(vignoble(state.filtre));
    } else {
      c.innerHTML = '<span class="eyebrow">La carte</span><h3 class="vg-name">De la Champagne <em>à la Corse</em></h3>' +
        '<p class="vg-note muted">Choisissez un vignoble ou cliquez sur un point de la carte. Tous ces vins arrivent ensuite dans notre cave du Vieux-Lille.</p>';
    }
  }

  function renderList() {
    var h = "";
    VIGNOBLES.forEach(function (vg) {
      if (state.filtre && state.filtre !== vg.nom) return;
      var idx = indicesDe(vg.nom);
      h += '<div class="vg-group"><div class="vg-group-head"><span>' + esc(vg.nom) + "</span><em>" + deux(idx.length) + "</em></div><ul>";
      idx.forEach(function (i) {
        h += '<li><button class="vg-item' + (i === state.sel ? " on" : "") + '" data-vg-i="' + i + '">' + esc(LISTE[i].nom) + "</button></li>";
      });
      h += "</ul></div>";
    });
    $("[data-vg-list]").innerHTML = h;
  }

  function renderPoints() {
    gPts.forEach(function (g, i) {
      var v = LISTE[i];
      g.classList.toggle("off", !!state.filtre && v.vignoble !== state.filtre);
      g.classList.toggle("on", i === state.sel);
    });
    // le point sélectionné passe au premier plan
    if (state.sel > -1) svg.querySelector(".vg-points").appendChild(gPts[state.sel]);
    $("[data-vg-reset]").hidden = !state.filtre;
  }

  function setFiltre(nom) {
    state.filtre = nom;
    if (state.sel > -1 && nom && LISTE[state.sel].vignoble !== nom) state.sel = -1;
    renderChips(); renderCard(); renderList(); renderPoints();
    zoomTo(cadre(nom ? indicesDe(nom) : []));
  }

  function select(i, fromMap) {
    state.sel = i;
    renderCard(); renderList(); renderPoints();
    var item = document.querySelector('[data-vg-i="' + i + '"]'), list = $("[data-vg-list]");
    if (item && fromMap) list.scrollTop = item.offsetTop - list.clientHeight / 3;
  }

  /* ---------- Info-bulle ---------- */
  function showTip(i) {
    var p = pts[i], r = svg.getBoundingClientRect(), wr = wrap.getBoundingClientRect();
    var x = (p[0] - view[0]) / view[2] * r.width + r.left - wr.left;
    var y = (p[1] - view[1]) / view[3] * r.height + r.top - wr.top;
    tip.innerHTML = "<strong>" + esc(LISTE[i].nom) + "</strong><span>" + esc(LISTE[i].vignoble) + "</span>";
    tip.style.left = x + "px";
    tip.style.top = y + "px";
    tip.hidden = false;
  }

  svg.addEventListener("mouseover", function (e) { var g = e.target.closest(".vg-pt"); if (g) showTip(+g.getAttribute("data-i")); });
  svg.addEventListener("mouseout", function (e) { if (e.target.closest(".vg-pt")) tip.hidden = true; });
  svg.addEventListener("click", function (e) { var g = e.target.closest(".vg-pt"); if (g) select(+g.getAttribute("data-i"), true); });

  document.addEventListener("click", function (e) {
    var f = e.target.closest("[data-vg-f]"), it = e.target.closest("[data-vg-i]"), rs = e.target.closest("[data-vg-reset]");
    if (f) setFiltre(f.getAttribute("data-vg-f"));
    else if (it) select(+it.getAttribute("data-vg-i"), false);
    else if (rs) setFiltre("");
  });
  $("[data-vg-list]").addEventListener("mouseover", function (e) {
    var it = e.target.closest("[data-vg-i]");
    gPts.forEach(function (g) { g.classList.remove("hl"); });
    if (it) { var g = gPts[+it.getAttribute("data-vg-i")]; g.classList.add("hl"); svg.querySelector(".vg-points").appendChild(g); }
  });
  $("[data-vg-list]").addEventListener("mouseleave", function () { gPts.forEach(function (g) { g.classList.remove("hl"); }); });

  draw(FULL);
  renderChips(); renderCard(); renderList(); renderPoints();
})();
