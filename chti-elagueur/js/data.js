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
    secteur: "Déplacement dans tout le Nord (59) et le Pas-de-Calais (62)",
    horaires: "Du lundi au vendredi, de 8 h à 19 h",
    horairesCourt: "Lun – Ven · 8 h – 19 h",
    siret: "",                       // à compléter
    lienPlan: "https://www.google.com/maps/search/?api=1&query=Lambersart+59130"
  },

  /* Agence qui a réalisé le site (affichée dans le pied de page) */
  AGENCE: { nom: "Groupe Épure", lien: "#" },

  /* Les 7 services (d'après la fiche Google du client) */
  SERVICES: [
    { titre: "Élagage d’arbres", lien: "elagage-arbres.html", photo: "images/photos/elagueur-1.webp",
      accroche: "Des arbres sains, sûrs et bien dessinés." },
    { titre: "Abattage d’arbres", lien: "abattage-arbres.html", photo: "images/photos/abattage-arbres-et-haies-3.webp",
      accroche: "Même les arbres dangereux, en toute sécurité." },
    { titre: "Taille de haies", lien: "taille-de-haies.html", photo: "images/photos/taille-de-haie-1.webp",
      accroche: "Des haies nettes, à prix modérés." },
    { titre: "Taille d’arbres", lien: "taille-arbres.html", photo: "images/photos/elagueur-3.webp",
      accroche: "Arbres d’ornement et fruitiers, taillés avec soin." },
    { titre: "Dessouchage", lien: "dessouchage.html", photo: "images/photos/dessouchage-arbre-et-haie-1.webp",
      accroche: "Souches retirées, terrain dégagé." },
    { titre: "Entretien de jardins", lien: "entretien-jardins.html", photo: "images/photos/taille-de-haie-2.webp",
      accroche: "Jardins et espaces verts, toute l’année." },
    { titre: "Évacuation des déchets verts", lien: "evacuation-dechets-verts.html", photo: "images/photos/abattage-arbres-et-haies-2.webp",
      accroche: "Branches, troncs, feuilles : on emporte tout." }
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
