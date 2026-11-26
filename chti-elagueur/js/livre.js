/* ==========================================================================
   Le Ch’ti Élagueur — livre des réalisations
   --------------------------------------------------------------------------
   Utilise page-flip (js/vendor/page-flip.browser.js, licence MIT) : c'est le
   moteur de react-pageflip, sans React. Couverture rigide, une réalisation
   par page, quatrième de couverture rigide.
   - Le livre n'est créé qu'à l'approche de la section (rien pendant la vidéo).
   - Les grandes photos ne sont chargées qu'à ce moment-là.
   - Boutons précédent / suivant, flèches du clavier, compteur de pages.
   - Sur téléphone : une page à la fois ; le défilement vertical reste libre.
   ========================================================================== */
(function () {
  "use strict";
  var el = document.getElementById("livre");
  if (!el) return;
  var racine = el.closest(".livre-section");
  var compteur = racine.querySelector(".livre-compteur");
  var nbChantiers = el.querySelectorAll(".livre-page[data-chantier]").length;
  var pf = null;

  function charger() {
    el.querySelectorAll("img[data-src]").forEach(function (i) { i.src = i.getAttribute("data-src"); i.removeAttribute("data-src"); });
  }

  function texteCompteur() {
    if (!pf) return;
    var i = pf.getCurrentPageIndex(), total = pf.getPageCount();
    var paysage = pf.getOrientation && pf.getOrientation() === "landscape";
    var txt;
    if (i === 0) txt = "Couverture";
    else if (i >= total - 1) txt = "Fin du livre";
    else {
      var a = i, b = paysage ? Math.min(i + 1, nbChantiers) : i;
      txt = a === b ? "Chantier " + a + " / " + nbChantiers : "Chantiers " + a + " – " + b + " / " + nbChantiers;
    }
    compteur.textContent = txt;
    var actif = document.activeElement;
    racine.querySelectorAll(".livre-nav.prec").forEach(function (b) { b.disabled = i === 0; });
    racine.querySelectorAll(".livre-nav.suiv").forEach(function (b) { b.disabled = i >= total - 1; });
    // un bouton désactivé perd la sélection clavier : on la passe à l'autre bouton
    if (actif && actif.disabled && actif.classList.contains("livre-nav")) {
      var autre = actif.parentNode.querySelector(".livre-nav:not(:disabled)");
      if (autre) autre.focus();
    }
  }

  function creer() {
    if (pf || !window.St || !window.St.PageFlip) return;
    charger();
    pf = new window.St.PageFlip(el, {
      width: 380, height: 520, size: "stretch",
      minWidth: 260, maxWidth: 440, minHeight: 356, maxHeight: 602,
      maxShadowOpacity: 0.5, drawShadow: true, showCover: true,
      flippingTime: 850, usePortrait: true, mobileScrollSupport: true, swipeDistance: 30
    });
    pf.loadFromHTML(el.querySelectorAll(".livre-page"));
    pf.on("flip", texteCompteur);
    pf.on("changeOrientation", texteCompteur);
    pf.on("init", texteCompteur);
    texteCompteur();
    racine.querySelectorAll(".livre-nav.prec").forEach(function (b) { b.addEventListener("click", function () { pf.flipPrev("bottom"); }); });
    racine.querySelectorAll(".livre-nav.suiv").forEach(function (b) { b.addEventListener("click", function () { pf.flipNext("bottom"); }); });
    // Flèches du clavier : actives dès que le livre est à l'écran (hors saisie dans un formulaire)
    var visible = false;
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }, { threshold: 0.35 }).observe(el);
    // Hors de l'écran, le livre n'écoute plus les mouvements du doigt sur toute la page
    // (page-flip les écoute sur window) : le défilement du reste du site reste parfaitement libre.
    var ui = pf.getUI && pf.getUI(), branche = true;
    if (ui && ui.removeHandlers && ui.setHandlers) {
      new IntersectionObserver(function (en) {
        var dedans = en[0].isIntersecting;
        if (dedans && !branche) { ui.setHandlers(); branche = true; try { pf.update(); } catch (e) {} }
        else if (!dedans && branche) { ui.removeHandlers(); branche = false; }
      }, { rootMargin: "200px 0px" }).observe(racine);
    }
    document.addEventListener("keydown", function (e) {
      if (!visible || e.altKey || e.ctrlKey || e.metaKey) return;
      var t = e.target && e.target.tagName;
      if (t === "INPUT" || t === "TEXTAREA" || t === "SELECT") return;
      if (e.key === "ArrowRight") { pf.flipNext("bottom"); e.preventDefault(); }
      if (e.key === "ArrowLeft") { pf.flipPrev("bottom"); e.preventDefault(); }
    });
  }

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (en) {
      if (en[0].isIntersecting) { io.disconnect(); creer(); }
    }, { rootMargin: "900px 0px" });
    io.observe(racine);
  } else creer();
})();
