/* ==========================================================================
   Le Ch’ti Élagueur — données du site
   --------------------------------------------------------------------------
   Toutes les coordonnées, la liste des services et des villes se modifient
   ICI : l'en-tête, le menu, le pied de page et le bloc « Devis » de toutes
   les pages se mettent à jour automatiquement.
   Les champs laissés vides (e-mail, rue, SIRET) sont simplement masqués.
   ========================================================================== */
window.SITE = {
  CONTACT: {
    nom: "Le Ch’ti Élagueur",
    logoNom: "Le Ch’ti Élagueur",
    logoSous: "Lambersart · 59",
    telephone: "06 04 43 98 99",
    telephoneLien: "+33604439899",
    email: "",                       // pas encore d'adresse e-mail
    adresse: "",                     // rue à compléter
    codePostal: "59130",
    ville: "Lambersart",
    secteur: "Lambersart et la métropole lilloise",
    horaires: "Du lundi au vendredi, de 8 h à 19 h",
    horairesCourt: "Lun – Ven · 8 h – 19 h",
    siret: "",                       // à compléter
    lienPlan: "https://www.google.com/maps/search/?api=1&query=Lambersart+59130"
  },

  /* Agence qui a réalisé le site (affichée dans le pied de page) */
  AGENCE: { nom: "Groupe Épure", lien: "#" },

  /* Les 8 services */
  SERVICES: [
    { titre: "Élagage", lien: "index.html#elagage", photo: "images/photos/elagage-1-600.webp",
      accroche: "Des arbres sains, sûrs et élégants." },
    { titre: "Dessouchage arbre et haie", lien: "dessouchage-arbre-et-haie-59.html", photo: "images/photos/dessouchage-arbre-et-haie-1.webp",
      accroche: "Souches et racines retirées, terrain dégagé." },
    { titre: "Taille de haie", lien: "taille-de-haie-59.html", photo: "images/photos/taille-de-haie-1.webp",
      accroche: "Des haies nettes, denses et bien dessinées." },
    { titre: "Création de pelouse", lien: "creation-de-pelouse-59.html", photo: "images/photos/creation-de-pelouse-1.webp",
      accroche: "Un gazon dense, de la préparation du sol à la pose." },
    { titre: "Abattage arbres et haies", lien: "abattage-arbres-et-haies-59.html", photo: "images/photos/abattage-arbres-et-haies-3.webp",
      accroche: "Abattage d'arbres et de haies, travail soigné." },
    { titre: "Jardinier", lien: "jardinier-59.html", photo: "images/photos/jardinier-1.webp",
      accroche: "Entretien de jardin, de la tonte à la plantation." },
    { titre: "Élagueur", lien: "elagueur-59.html", photo: "images/photos/elagueur-1.webp",
      accroche: "Élagage de tout type d'arbre." },
    { titre: "Taille de haie et arbres fruitiers", lien: "taille-de-haie-et-arbres-fruitiers-59.html", photo: "images/photos/taille-de-haie-et-arbres-fruitiers-2.webp",
      accroche: "Des coupes pensées pour la floraison et la récolte." }
  ],

  /* Zones d'intervention autour de Lambersart (pages « Élagueur à … ») */
  VILLES: [
    { ville: "Lille", cp: "59000", lien: "elagueur-a-lille-59000.html" },
    { ville: "Lomme", cp: "59160", lien: "elagueur-a-lomme-59160.html" },
    { ville: "Saint-André-lez-Lille", cp: "59350", lien: "elagueur-a-saint-andre-lez-lille-59350.html" },
    { ville: "La Madeleine", cp: "59110", lien: "elagueur-a-la-madeleine-59110.html" },
    { ville: "Marcq-en-Barœul", cp: "59700", lien: "elagueur-a-marcq-en-baroeul-59700.html" },
    { ville: "Wambrechies", cp: "59118", lien: "elagueur-a-wambrechies-59118.html" },
    { ville: "Pérenchies", cp: "59840", lien: "elagueur-a-perenchies-59840.html" }
  ]
};
