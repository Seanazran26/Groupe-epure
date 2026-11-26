/* ==========================================================================
   Le Ch’ti Élagueur — script commun à toutes les pages
   --------------------------------------------------------------------------
   1. Icônes & logo
   2. En-tête, menu mobile, pied de page, bloc devis, barre mobile
      (générés à partir de js/data.js — un seul endroit à modifier)
   3. Interactions : menus, apparition au défilement, curseur avant/après,
      visionneuse photo, formulaires (démo), effet de profondeur
   ========================================================================== */
(function () {
  "use strict";
  var D = window.SITE;
  var C = D.CONTACT;
  var doc = document;
  var mouvementReduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  doc.documentElement.classList.remove("js-off");

  /* 1. Icônes -------------------------------------------------------------- */
  var P = {
    tel: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
    mail: '<rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/><path d="m22 7-10 6.5L2 7"/>',
    lieu: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
    horloge: '<circle cx="12" cy="12" r="9.5"/><path d="M12 7v5l3.5 2"/>',
    fleche: '<path d="M4.5 12h15M13.5 6l6 6-6 6"/>',
    diagonale: '<path d="M7 17 17 7M8.5 7H17v8.5"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
    fermer: '<path d="M6 6l12 12M18 6 6 18"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    coche: '<path d="M20 6 9 17l-5-5"/>',
    feuille: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10Z"/><path d="M2 21c0-3 1.9-5.4 5.2-6.1 2.4-.5 4.9-2 5.8-3.9"/>',
    rappel: '<path d="M15.5 2.5v5h5"/><path d="m21 2-6 6"/><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>'
  };
  function ico(nom, classe) {
    return '<svg class="icon' + (classe ? " " + classe : "") + '" viewBox="0 0 24 24" aria-hidden="true">' + P[nom] + "</svg>";
  }
  window.SITE.icone = ico;

  var LOGO_SVG =
    '<svg viewBox="0 0 64 64" aria-hidden="true">' +
    '<path d="M9 42a23 23 0 1 1 46 0" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>' +
    '<g fill="#4b8a3a"><circle cx="32" cy="22" r="9.5"/><circle cx="23" cy="27" r="7.5"/><circle cx="41" cy="27" r="7.5"/>' +
    '<circle cx="27.5" cy="32" r="6.5"/><circle cx="36.5" cy="32" r="6.5"/></g>' +
    '<path d="M32 48V33M32 39l-5-4.5M32 37l5-4.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M19 49h26" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>';
  function logo(cls) {
    return '<a class="logo ' + (cls || "") + '" href="index.html" aria-label="' + C.nom + ' — accueil">' + LOGO_SVG +
      '<span class="logo-txt"><strong>' + C.logoNom + "</strong><small>" + C.logoSous + "</small></span></a>";
  }
  // Adresse : la rue si on l'a, sinon la commune (« Lambersart (59130) »)
  function lieu(br) {
    return C.adresse ? C.adresse + (br ? "<br>" : ", ") + C.codePostal + " " + C.ville : C.ville + " (" + C.codePostal + ")";
  }

  var pageCourante = (location.pathname.split("/").pop() || "index.html").split("#")[0];
  function courant(lien) { return lien.split("#")[0] === pageCourante ? ' aria-current="page"' : ""; }

  /* 2. Composants ------------------------------------------------------------ */
  function htmlEntete() {
    var services = D.SERVICES.map(function (s) {
      return '<a href="' + s.lien + '"><img src="' + s.photo + '" alt="" width="64" height="52" loading="lazy">' +
        "<span><strong>" + s.titre + "</strong><span>" + s.accroche + "</span></span></a>";
    }).join("");
    var villes = '<a href="index.html#zones">' + C.ville + " <span>" + C.codePostal + "</span></a>" + D.VILLES.map(function (v) {
      return '<a href="' + v.lien + '">' + v.ville + " <span>" + v.cp + "</span></a>";
    }).join("");
    var pageService = D.SERVICES.some(function (s) { return s.lien.split("#")[0] === pageCourante && pageCourante !== "index.html"; });
    var pageVille = D.VILLES.some(function (v) { return v.lien === pageCourante; });

    return '<a class="skip" href="#contenu">Aller au contenu</a>' +
      '<div class="bandeau-info"><div class="wrap"><ul>' +
      "<li>" + ico("horloge") + C.horaires + "</li>" +
      "<li>" + ico("lieu") + lieu() + "</li></ul>" +
      (C.email ? '<a href="mailto:' + C.email + '">' + ico("mail") + C.email + "</a>"
               : '<a href="tel:' + C.telephoneLien + '">' + ico("tel") + C.telephone + "</a>") + "</div></div>" +
      '<header class="entete"><div class="wrap">' + logo() +
      '<nav class="nav" aria-label="Navigation principale"><ul>' +
      '<li><a class="nav-lien" href="index.html"' + courant("index.html") + ">Accueil</a></li>" +
      '<li class="has-drop"><button class="nav-lien" type="button" aria-expanded="false"' + (pageService ? ' aria-current="page"' : "") + ">Nos services " + ico("chevron", "chevron") + "</button>" +
      '<div class="menu-deroulant"><div class="menu-services">' + services + "</div></div></li>" +
      '<li><a class="nav-lien" href="realisations.html"' + courant("realisations.html") + ">Réalisations</a></li>" +
      '<li class="has-drop"><button class="nav-lien" type="button" aria-expanded="false"' + (pageVille ? ' aria-current="page"' : "") + ">Zones d'intervention " + ico("chevron", "chevron") + "</button>" +
      '<div class="menu-deroulant"><div class="menu-villes">' + villes + "</div></div></li>" +
      '<li><a class="nav-lien" href="contact.html"' + courant("contact.html") + ">Contact</a></li>" +
      "</ul></nav>" +
      '<div class="entete-actions">' +
      '<a class="entete-tel" href="tel:' + C.telephoneLien + '">' + ico("tel") + C.telephone + "</a>" +
      '<a class="btn btn--primaire btn--petit" href="devis-gratuit.html">Devis gratuit ' + ico("fleche", "icon--fleche") + "</a>" +
      '<button class="burger" type="button" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="menu-mobile">' + ico("menu") + "</button>" +
      "</div></div></header>" +
      '<div class="menu-mobile" id="menu-mobile" role="dialog" aria-modal="true" aria-label="Menu">' +
      '<div class="menu-mobile-haut">' + logo() + '<button class="fermer" type="button" aria-label="Fermer le menu">' + ico("fermer") + "</button></div>" +
      '<nav aria-label="Menu mobile"><ul class="grand">' +
      '<li><a href="index.html">Accueil</a></li>' +
      "<li><details><summary>Nos services " + ico("chevron", "chevron") + '</summary><div class="sous">' +
      D.SERVICES.map(function (s) { return '<a href="' + s.lien + '">' + s.titre + "</a>"; }).join("") + "</div></details></li>" +
      '<li><a href="realisations.html">Réalisations</a></li>' +
      "<li><details><summary>Zones d'intervention " + ico("chevron", "chevron") + '</summary><div class="sous">' + villes.replace(/<span>/g, " <span>") + "</div></details></li>" +
      '<li><a href="contact.html">Contact</a></li></ul></nav>' +
      '<div class="menu-mobile-bas">' +
      '<a class="btn btn--pousse btn--bloc" href="devis-gratuit.html">Demander un devis gratuit ' + ico("fleche", "icon--fleche") + "</a>" +
      '<a class="btn btn--contour-clair btn--bloc" href="tel:' + C.telephoneLien + '">' + ico("tel") + " " + C.telephone + "</a>" +
      "<p>" + C.horaires + "</p></div></div>";
  }

  function htmlDevis(el) {
    var titre = el.getAttribute("data-titre") || "Parlons de votre <em>jardin</em>";
    var choisi = el.getAttribute("data-service") || "";
    var options = D.SERVICES.map(function (s) {
      return "<option" + (s.titre === choisi ? " selected" : "") + ">" + s.titre + "</option>";
    }).join("");
    return '<section class="section section--tight" id="devis" aria-labelledby="titre-devis"><div class="wrap"><div class="devis" data-apparition>' +
      "<div>" +
      '<p class="etiquette etiquette--clair">Devis gratuit</p>' +
      '<h2 id="titre-devis">' + titre + "</h2>" +
      '<p class="devis-intro">Décrivez votre projet en quelques mots : nous vous répondons dans les meilleurs délais. Le devis est gratuit.</p>' +
      '<form class="formulaire" data-formulaire="devis">' +
      '<div class="champ"><input id="f-nom" name="nom" type="text" placeholder=" " autocomplete="family-name" required><label for="f-nom">Votre nom</label></div>' +
      '<div class="champ"><input id="f-prenom" name="prenom" type="text" placeholder=" " autocomplete="given-name" required><label for="f-prenom">Votre prénom</label></div>' +
      '<div class="champ"><input id="f-tel" name="telephone" type="tel" placeholder=" " autocomplete="tel" required><label for="f-tel">Votre téléphone</label></div>' +
      '<div class="champ"><input id="f-mail" name="email" type="email" placeholder=" " autocomplete="email" required><label for="f-mail">Votre e-mail</label></div>' +
      '<div class="champ"><input id="f-cp" name="code_postal" type="text" inputmode="numeric" placeholder=" " autocomplete="postal-code" required><label for="f-cp">Votre code postal</label></div>' +
      '<div class="champ"><select id="f-service" name="service"><option value="">Je ne sais pas encore</option>' + options + '</select><label for="f-service">Service souhaité</label></div>' +
      '<div class="champ champ--large"><textarea id="f-msg" name="message" placeholder=" " required></textarea><label for="f-msg">Votre message</label></div>' +
      '<input class="piege" type="text" name="site_web" tabindex="-1" autocomplete="off" aria-hidden="true">' +
      '<button class="btn btn--pousse" type="submit">Envoyer ma demande ' + ico("fleche", "icon--fleche") + "</button>" +
      '<p class="mention">Vos coordonnées servent uniquement à répondre à votre demande.</p>' +
      "</form></div>" +
      '<div class="coordonnees">' +
      '<a class="ligne grand" href="tel:' + C.telephoneLien + '"><span class="rond-icone">' + ico("tel") + "</span><span><small>Téléphone</small><strong>" + C.telephone + "</strong></span></a>" +
      (C.email ? '<a class="ligne" href="mailto:' + C.email + '"><span class="rond-icone">' + ico("mail") + "</span><span><small>E-mail</small><strong>" + C.email + "</strong></span></a>" : "") +
      '<a class="ligne" href="' + C.lienPlan + '" target="_blank" rel="noopener"><span class="rond-icone">' + ico("lieu") + "</span><span><small>" + (C.adresse ? "Adresse" : "Secteur") + "</small><strong>" +
        (C.adresse ? lieu(true) : lieu() + "<br>et toute la métropole lilloise") + "</strong></span></a>" +
      '<div class="ligne"><span class="rond-icone">' + ico("horloge") + "</span><span><small>Disponibilités</small><strong>" + C.horaires + "</strong></span></div>" +
      "</div></div></div></section>";
  }

  function htmlPied() {
    var annee = new Date().getFullYear();
    return '<footer class="pied"><div class="wrap"><div class="pied-haut">' +
      "<div>" + logo() +
      '<p class="pied-presentation">Élagueur à ' + C.ville + ' et dans la métropole lilloise : élagage, taille de haie, abattage, dessouchage, création de pelouse et entretien de jardin.</p>' +
      '<a class="btn btn--pousse btn--petit" href="devis-gratuit.html">Devis gratuit ' + ico("fleche", "icon--fleche") + "</a></div>" +
      "<div><h3>Nos services</h3><ul>" + D.SERVICES.map(function (s) { return '<li><a href="' + s.lien + '">' + s.titre + "</a></li>"; }).join("") + "</ul></div>" +
      "<div><h3>Zones d'intervention</h3><ul><li><a href=\"index.html#zones\">Élagueur à " + C.ville + "</a></li>" +
      D.VILLES.map(function (v) { return '<li><a href="' + v.lien + '">Élagueur à ' + v.ville + "</a></li>"; }).join("") + "</ul></div>" +
      '<div class="pied-contact"><h3>Contact</h3><ul>' +
      "<li>" + ico("lieu") + "<span>" + lieu(true) + "</span></li>" +
      '<li>' + ico("tel") + '<a href="tel:' + C.telephoneLien + '">' + C.telephone + "</a></li>" +
      (C.email ? '<li>' + ico("mail") + '<a href="mailto:' + C.email + '">' + C.email + "</a></li>" : "") +
      "<li>" + ico("horloge") + "<span>" + C.horaires + "</span></li></ul></div>" +
      '</div><div class="pied-marque" aria-hidden="true">Ch’ti Élagueur</div>' +
      '<div class="pied-bas"><span>© ' + annee + " " + C.nom + (C.siret ? " · SIRET " + C.siret : "") + "</span>" +
      '<nav aria-label="Liens légaux"><a href="mentions-legales.html">Mentions légales</a><a href="contact.html">Contact</a><a href="realisations.html">Réalisations</a></nav>' +
      '<span>Site réalisé par <a href="' + D.AGENCE.lien + '">' + D.AGENCE.nom + "</a></span></div>" +
      "</div></footer>" +
      '<div class="barre-mobile">' +
      '<a class="btn btn--contour-clair" href="tel:' + C.telephoneLien + '">' + ico("tel") + " Appeler</a>" +
      '<a class="btn btn--pousse" href="devis-gratuit.html">Devis gratuit ' + ico("fleche", "icon--fleche") + "</a></div>";
  }

  function remplacer(sel, html) {
    var el = typeof sel === "string" ? doc.querySelector(sel) : sel;
    if (el) el.outerHTML = typeof html === "function" ? html(el) : html;
  }
  remplacer('[data-composant="entete"]', htmlEntete);
  doc.querySelectorAll('[data-composant="devis"]').forEach(function (el) { remplacer(el, htmlDevis); });
  remplacer('[data-composant="pied"]', htmlPied);

  /* Boutons « shiny » : le texte est placé dans un <span> (le reflet le traverse) ; l'animation
     ne tourne que pour les boutons à l'écran, avec un léger rebond la première fois. */
  doc.querySelectorAll(".btn").forEach(function (b) {
    if (b.querySelector(":scope > .btn-txt")) return;
    var t = doc.createElement("span"); t.className = "btn-txt";
    while (b.firstChild) t.appendChild(b.firstChild);
    b.appendChild(t);
  });
  if ("IntersectionObserver" in window && !mouvementReduit) {
    // Le reflet est suspendu PENDANT le défilement (il forcerait un redessin à chaque image, au
    // détriment de la vidéo d'accueil) et reprend dès que le visiteur s'arrête.
    var visibles = new Set(), enDefilement = false, minuteurBtn = 0;
    window.addEventListener("scroll", function () {
      if (!enDefilement) { enDefilement = true; visibles.forEach(function (b) { b.classList.add("shiny-pause"); }); }
      clearTimeout(minuteurBtn);
      minuteurBtn = setTimeout(function () {
        enDefilement = false;
        doc.querySelectorAll(".btn.shiny-pause").forEach(function (b) { b.classList.remove("shiny-pause"); });
      }, 220);
    }, { passive: true });
    var ioBtn = new IntersectionObserver(function (en) {
      en.forEach(function (x) {
        var b = x.target;
        b.classList.toggle("shiny-actif", x.isIntersecting);
        if (x.isIntersecting) { visibles.add(b); if (enDefilement) b.classList.add("shiny-pause"); }
        else visibles.delete(b);
        if (x.isIntersecting && !b.dataset.pop) {
          b.dataset.pop = "1"; b.classList.add("shiny-pop");
          setTimeout(function () { b.classList.remove("shiny-pop"); }, 700);
        }
      });
    });
    doc.querySelectorAll(".btn").forEach(function (b) { ioBtn.observe(b); });
  }

  /* Petites données injectées dans le texte : <span data-c="telephone"></span> */
  doc.querySelectorAll("[data-c]").forEach(function (el) {
    var k = el.getAttribute("data-c");
    if (k === "agence") { el.textContent = D.AGENCE.nom; return; }
    if (C[k] != null) el.textContent = C[k];
  });
  doc.querySelectorAll("[data-tel]").forEach(function (a) { a.href = "tel:" + C.telephoneLien; });
  doc.querySelectorAll("[data-mail]").forEach(function (a) { a.href = "mailto:" + C.email; });

  /* 3. Interactions ------------------------------------------------------------ */
  var entete = doc.querySelector(".entete");
  var herosAccueil = doc.querySelector(".heros-scroll");
  // Accueil : la barre de menu reste transparente tant qu'elle est posée sur la vidéo
  function surDefilement() {
    if (!entete) return;
    entete.classList.toggle("est-defile", window.scrollY > 10);
    // transparente pendant toute la vidéo ; pleine dès que la vidéo se termine et que la page continue
    if (herosAccueil) {
      var scene = herosAccueil.querySelector(".hs-scene");
      var surVideo = herosAccueil.getBoundingClientRect().bottom >= (scene ? scene.offsetHeight : window.innerHeight) - 2;
      entete.classList.toggle("transparent", surVideo);
      entete.classList.toggle("cache", !surVideo);          // après la vidéo : plus de barre du tout
      if (!surVideo) doc.querySelectorAll(".has-drop.ouvert").forEach(function (x) { x.classList.remove("ouvert"); });
    }
  }
  window.addEventListener("scroll", surDefilement, { passive: true });
  surDefilement();

  /* Menus déroulants (clic / clavier ; le survol est géré en CSS) */
  doc.querySelectorAll(".has-drop > button").forEach(function (b) {
    b.addEventListener("click", function (e) {
      e.stopPropagation();
      var li = b.parentElement, ouvrir = !li.classList.contains("ouvert");
      doc.querySelectorAll(".has-drop.ouvert").forEach(function (x) { x.classList.remove("ouvert"); x.firstElementChild.setAttribute("aria-expanded", "false"); });
      li.classList.toggle("ouvert", ouvrir); b.setAttribute("aria-expanded", String(ouvrir));
    });
  });
  doc.addEventListener("click", function () { doc.querySelectorAll(".has-drop.ouvert").forEach(function (x) { x.classList.remove("ouvert"); x.firstElementChild.setAttribute("aria-expanded", "false"); }); });

  /* Menu mobile */
  var menu = doc.getElementById("menu-mobile"), burger = doc.querySelector(".burger");
  function basculerMenu(ouvrir) {
    if (!menu) return;
    menu.classList.toggle("ouvert", ouvrir);
    doc.body.classList.toggle("menu-ouvert", ouvrir);
    burger.setAttribute("aria-expanded", String(ouvrir));
    if (ouvrir) menu.querySelector(".fermer").focus(); else burger.focus();
  }
  if (burger) burger.addEventListener("click", function () { basculerMenu(true); });
  if (menu) {
    menu.querySelector(".fermer").addEventListener("click", function () { basculerMenu(false); });
    menu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { basculerMenu(false); }); });
  }
  doc.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (menu && menu.classList.contains("ouvert")) basculerMenu(false);
    doc.querySelectorAll(".has-drop.ouvert").forEach(function (x) { x.classList.remove("ouvert"); });
  });

  /* Titres animés mot par mot : ajoutez la classe "mots" à n'importe quel titre */
  doc.querySelectorAll(".mots").forEach(function (titre) {
    var i = 0;
    (function decouper(noeud) {
      Array.prototype.slice.call(noeud.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = doc.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (m) {
            if (!m) return;
            if (/^\s+$/.test(m)) { frag.appendChild(doc.createTextNode(" ")); return; }
            var mot = doc.createElement("span"); mot.className = "mot";
            var inner = doc.createElement("span"); inner.style.setProperty("--i", i++); inner.textContent = m;
            mot.appendChild(inner); frag.appendChild(mot);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1 && n.tagName !== "BR") decouper(n);
      });
    })(titre);
  });

  /* Apparition au défilement : ajoutez data-apparition (ou ="gauche", "droite", "zoom") */
  var aObserver = doc.querySelectorAll("[data-apparition], .mots");
  if ("IntersectionObserver" in window && !mouvementReduit) {
    var io = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("est-visible"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    aObserver.forEach(function (el) { io.observe(el); });
  } else {
    aObserver.forEach(function (el) { el.classList.add("est-visible"); });
  }

  /* Curseur avant / après */
  doc.querySelectorAll(".ba").forEach(function (ba) {
    var range = ba.querySelector("input");
    function poser(v) { v = Math.max(0, Math.min(100, v)); ba.style.setProperty("--pos", v + "%"); if (range) range.value = v; }
    function depuisX(x) { var r = ba.getBoundingClientRect(); poser(((x - r.left) / r.width) * 100); }
    var glisse = false;
    ba.addEventListener("pointerdown", function (e) { glisse = true; ba.classList.add("actif"); ba.setPointerCapture(e.pointerId); depuisX(e.clientX); });
    ba.addEventListener("pointermove", function (e) { if (glisse) depuisX(e.clientX); });
    ["pointerup", "pointercancel", "lostpointercapture"].forEach(function (t) { ba.addEventListener(t, function () { glisse = false; ba.classList.remove("actif"); }); });
    if (range) range.addEventListener("input", function () { poser(+range.value); });
    /* Petite démonstration automatique la première fois que le curseur apparaît */
    if (!mouvementReduit && "IntersectionObserver" in window) {
      var vu = new IntersectionObserver(function (en) {
        if (!en[0].isIntersecting) return; vu.disconnect();
        var t0 = null, etapes = [50, 22, 78, 50];
        function anim(t) {
          if (glisse) return;
          if (!t0) t0 = t;
          var p = Math.min(1, (t - t0) / 2200), seg = Math.min(2, Math.floor(p * 3)), loc = p * 3 - seg;
          var e = loc < 0.5 ? 2 * loc * loc : 1 - Math.pow(-2 * loc + 2, 2) / 2;
          poser(etapes[seg] + (etapes[seg + 1] - etapes[seg]) * e);
          if (p < 1) requestAnimationFrame(anim);
        }
        setTimeout(function () { requestAnimationFrame(anim); }, 400);
      }, { threshold: 0.6 });
      vu.observe(ba);
    }
  });

  /* Visionneuse photo : liens avec data-visionneuse="groupe" */
  var liens = Array.prototype.slice.call(doc.querySelectorAll("[data-visionneuse]"));
  if (liens.length) {
    var v = doc.createElement("div");
    v.className = "visionneuse"; v.setAttribute("role", "dialog"); v.setAttribute("aria-modal", "true"); v.setAttribute("aria-label", "Photo agrandie");
    v.innerHTML = '<img alt=""><button class="v-fermer" type="button" aria-label="Fermer">' + ico("fermer") + "</button>" +
      '<button class="v-prec" type="button" aria-label="Photo précédente">' + ico("fleche") + "</button>" +
      '<button class="v-suiv" type="button" aria-label="Photo suivante">' + ico("fleche") + '</button><div class="v-compteur"></div>';
    doc.body.appendChild(v);
    var img = v.querySelector("img"), compteur = v.querySelector(".v-compteur"), groupe = [], idx = 0, dernierFocus = null;
    function montrer(i) {
      idx = (i + groupe.length) % groupe.length;
      var a = groupe[idx]; img.src = a.getAttribute("href"); img.alt = (a.querySelector("img") || {}).alt || "";
      compteur.textContent = (idx + 1) + " / " + groupe.length;
    }
    function fermer() { v.classList.remove("ouvert"); doc.body.classList.remove("menu-ouvert"); if (dernierFocus) dernierFocus.focus(); }
    liens.forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault(); dernierFocus = a;
        var g = a.getAttribute("data-visionneuse");
        groupe = liens.filter(function (x) { return x.getAttribute("data-visionneuse") === g; });
        montrer(groupe.indexOf(a)); v.classList.add("ouvert"); doc.body.classList.add("menu-ouvert"); v.querySelector(".v-fermer").focus();
      });
    });
    v.querySelector(".v-fermer").addEventListener("click", fermer);
    v.querySelector(".v-prec").addEventListener("click", function () { montrer(idx - 1); });
    v.querySelector(".v-suiv").addEventListener("click", function () { montrer(idx + 1); });
    v.addEventListener("click", function (e) { if (e.target === v) fermer(); });
    doc.addEventListener("keydown", function (e) {
      if (!v.classList.contains("ouvert")) return;
      if (e.key === "Escape") fermer();
      if (e.key === "ArrowLeft") montrer(idx - 1);
      if (e.key === "ArrowRight") montrer(idx + 1);
    });
    var x0 = null;
    v.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    v.addEventListener("touchend", function (e) { if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) montrer(idx + (dx < 0 ? 1 : -1)); x0 = null; });
  }

  /* Formulaires — DÉMO : l'envoi réel sera branché à la mise en ligne
     (PHP, Formspree, Brevo…). Ici on vérifie les champs et on affiche un message. */
  doc.querySelectorAll("form[data-formulaire]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      if (f.querySelector(".piege") && f.querySelector(".piege").value) return;
      if (!f.checkValidity()) { f.reportValidity(); return; }
      var ancien = f.querySelector(".merci, .rappel-merci"); if (ancien) ancien.remove();
      var prenom = (f.querySelector('[name="prenom"]') || {}).value;
      var msg = doc.createElement(f.getAttribute("data-formulaire") === "rappel" ? "p" : "div");
      if (f.getAttribute("data-formulaire") === "rappel") {
        msg.className = "rappel-merci";
        msg.textContent = "Merci ! Votre numéro est bien noté. (Démo : l'envoi sera activé à la mise en ligne.)";
        f.insertAdjacentElement("afterend", msg);
      } else {
        msg.className = "merci"; msg.setAttribute("role", "status");
        msg.innerHTML = ico("coche") + "<div><strong>Merci" + (prenom ? " " + prenom.replace(/[<>&"]/g, "") : "") + " !</strong>" +
          "<p>Votre demande de devis est prête. Version de démonstration : l'envoi des formulaires sera activé à la mise en ligne du site.</p></div>";
        f.appendChild(msg);
      }
      f.reset();
    });
  });

  /* Ouvre le texte replié visé par un lien (ex. index.html#elagage) */
  function ouvrirCible() {
    var id = location.hash.slice(1), el = id && doc.getElementById(id);
    if (el && el.tagName === "DETAILS") { el.open = true; setTimeout(function () { el.scrollIntoView({ block: "center" }); }, 60); }
  }
  window.addEventListener("hashchange", ouvrirCible); ouvrirCible();

  /* Barre d'appel mobile : se cache quand le formulaire de devis est à l'écran */
  var barre = doc.querySelector(".barre-mobile"), devis = doc.getElementById("devis");
  /* …et n'apparaît qu'après le début du défilement (pour ne pas cacher le haut de page) */
  if (barre) {
    var herosScroll = doc.querySelector(".heros-scroll");
    var majBarre = function () {
      // sur l'accueil : la barre n'apparaît qu'une fois la vidéo du héros terminée
      var cache = herosScroll ? herosScroll.getBoundingClientRect().bottom > window.innerHeight * 0.6 : window.scrollY < 420;
      barre.classList.toggle("au-depart", cache);
    };
    window.addEventListener("scroll", majBarre, { passive: true }); majBarre();
  }
  if (barre && devis && "IntersectionObserver" in window) {
    new IntersectionObserver(function (en) { barre.classList.toggle("cachee", en[0].isIntersecting); }, { threshold: 0.15 }).observe(devis);
  }

  /* Animations permanentes en pause hors de l'écran (batterie, fluidité du défilement) */
  if ("IntersectionObserver" in window) {
    var ioPause = new IntersectionObserver(function (en) {
      en.forEach(function (x) { x.target.classList.toggle("hors-ecran", !x.isIntersecting); });
    }, { rootMargin: "80px 0px" });
    doc.querySelectorAll(".defilant, .page-heros").forEach(function (el) { ioPause.observe(el); });
  }

  /* Effet de profondeur sur les bandeaux photo */
  var parallaxes = doc.querySelectorAll("[data-profondeur]");
  if (parallaxes.length && !mouvementReduit) {
    var enCours = false;
    function maj() {
      parallaxes.forEach(function (img) {
        var r = img.parentElement.getBoundingClientRect(), h = window.innerHeight;
        if (r.bottom < 0 || r.top > h) return;
        var p = (r.top + r.height / 2 - h / 2) / (h + r.height);
        img.style.transform = "translate3d(0," + (p * -12).toFixed(2) + "%,0)";
      });
      enCours = false;
    }
    window.addEventListener("scroll", function () { if (!enCours) { enCours = true; requestAnimationFrame(maj); } }, { passive: true });
    maj();
  }
})();
