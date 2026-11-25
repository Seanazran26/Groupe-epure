/* ==========================================================================
   Lagrene Paysagiste 59 — données du site
   --------------------------------------------------------------------------
   Toutes les coordonnées, la liste des services et des villes se modifient
   ICI : l'en-tête, le menu, le pied de page et le bloc « Devis » de toutes
   les pages se mettent à jour automatiquement.
   ========================================================================== */
window.LAGRENE = {
  CONTACT: {
    nom: "Lagrene Paysagiste 59",
    telephone: "06 60 59 92 25",
    telephoneLien: "+33660599225",
    email: "lagrenerudy@gmail.com",
    adresse: "38 boulevard Carnot, Bureau n°\u00a03",
    codePostal: "59000",
    ville: "Lille",
    horaires: "Du lundi au vendredi, de 8\u00a0h à 19\u00a0h",
    horairesCourt: "Lun – Ven · 8\u00a0h – 19\u00a0h",
    siren: "531 041 218",
    lienPlan: "https://www.google.com/maps/search/?api=1&query=38+boulevard+Carnot+59000+Lille"
  },

  /* Agence qui a réalisé le site (affichée dans le pied de page) */
  AGENCE: { nom: "Groupe Épure", lien: "#" },

  /* Les 8 services (même ordre que sur le site actuel) */
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

  /* Zones d'intervention (pages « Paysagiste à … ») */
  VILLES: [
    { ville: "Wattignies", cp: "59139", lien: "paysagiste-a-wattignies-59139.html" },
    { ville: "Wattrelos", cp: "59150", lien: "paysagiste-a-wattrelos-59150.html" },
    { ville: "Roubaix", cp: "59100", lien: "paysagiste-a-roubaix-59100.html" },
    { ville: "Leers", cp: "59115", lien: "paysagiste-a-leers-59115.html" },
    { ville: "Hem", cp: "59510", lien: "paysagiste-a-hem-59510.html" },
    { ville: "Bondues", cp: "59910", lien: "paysagiste-a-bondues-59910.html" },
    { ville: "Villeneuve-d'Ascq", cp: "59491", lien: "paysagiste-a-villeneuve-d-ascq-59491.html" }
  ]
};
