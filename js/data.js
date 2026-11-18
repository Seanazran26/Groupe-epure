/* ==========================================================================
   VIN DES COPAINS — Données du site
   --------------------------------------------------------------------------
   Tout le catalogue est piloté par ce fichier :
   - REGIONS        : les régions (filtre « Région »)
   - CATEGORIES     : les catégories (filtre « Catégorie »)
   - CONSOMMATIONS  : quand déguster (filtre « Consommation »)
   - PRODUITS       : les bouteilles (nom, prix, image, région, catégories…)

   Pour ajouter une bouteille, copier un bloc de PRODUITS et remplir :
     id            identifiant unique (sans espace ni accent)
     nom           titre de la bouteille
     prix          prix en euros (nombre, ex. 12.9)
     image         chemin de l'image (ex. "assets/bouteilles/xxx.jpg"),
                   laisser "" pour afficher une bouteille illustrée
     region        slug d'une région ci-dessous (ex. "bordeaux")
     categories    liste de slugs de catégories (ex. ["vins-rouges", "vins-bio"])
     consommation  slug d'une consommation (ex. "belle-garde")
   ========================================================================== */

window.VDC = window.VDC || {};

/* --------------------------------------------------------------------------
   COORDONNÉES DU MAGASIN
   Reprises du site actuel (www.vinsdecopains.com).
   Un champ laissé vide ("") n'est simplement pas affiché.
   -------------------------------------------------------------------------- */
VDC.CONTACT = {
  enseigne:   "Vin des Copains",
  adresse:    "38 rue Princesse",
  codePostal: "59800",
  ville:      "Lille",
  quartier:   "Vieux-Lille",
  telephone:  "03 20 58 70 98",
  mobile:     "06 30 83 24 79",
  email:      "copain@vinsdecopains.com",
  horaires: [                // une ligne par plage horaire
    ["Lundi – Vendredi", "9h – 13h · 14h – 18h"]
  ],
  noteHoraires: "Retrait des commandes à la cave sur rendez-vous (horaires pouvant varier).",
  instagram:  "https://www.instagram.com/vinsdecopains/",
  facebook:   "",
  siteActuel: "https://www.vinsdecopains.com/",

  /* Livraison (reprise du site actuel) */
  livraison: {
    transporteur: "Colissimo",
    delai:        "2 à 3 jours",
    prix:         14.90,     // pour un colis de 3, 6 ou 9 bouteilles
    offerteDes:   12         // livraison offerte à partir de 12 bouteilles
  },

  /* Mentions légales (reprises du site actuel) */
  societe:    "GOURMANDING SARL",
  rcs:        "484 834 908",
  tva:        "FR 18 484 834 908",
  siret:      "530 6350 77 00015",
  accise:     "FR011487O0170",
  directeur:  "Xavier Trüb"
};

VDC.REGIONS = [
  { slug: "alsace",                 nom: "Alsace",                          note: "Rieslings ciselés, gewurztraminers parfumés et crémants vifs, au pied des Vosges." },
  { slug: "bandol",                 nom: "Bandol",                          note: "Le mourvèdre roi, face à la Méditerranée : rosés de caractère et rouges de garde." },
  { slug: "beaujolais",             nom: "Beaujolais",                      note: "Le gamay dans tous ses états, du fruit croquant aux grands crus de garde." },
  { slug: "bordeaux",               nom: "Bordeaux",                        note: "Assemblages de merlot et de cabernets, l'élégance des grands domaines girondins." },
  { slug: "bourgogne",              nom: "Bourgogne",                       note: "Pinot noir et chardonnay, la mosaïque des climats et des terroirs." },
  { slug: "champagne",              nom: "Champagne",                       note: "La finesse des bulles, de l'apéritif aux grandes occasions." },
  { slug: "charente",               nom: "Charente",                        note: "Entre océan et vignes du cognac, des vins charentais frais et gourmands." },
  { slug: "corse",                  nom: "Corse",                           note: "Vins de soleil et de maquis : niellucciu, sciaccarellu, vermentinu." },
  { slug: "cote-roannaise-urfe",    nom: "Côte Roannaise Urfé blanc IGP",   note: "Les blancs d'altitude des contreforts roannais, frais et minéraux." },
  { slug: "cote-roannaise",         nom: "Côte Roannaise",                  note: "Un gamay de granit, vif et gourmand, aux portes du Massif central." },
  { slug: "cotes-de-gascogne",      nom: "Côtes de Gascogne",               note: "Des blancs aromatiques et désaltérants, pour le plaisir du moment." },
  { slug: "languedoc",              nom: "Languedoc",                       note: "Soleil, garrigue et vignerons audacieux, entre mer et montagnes." },
  { slug: "loire",                  nom: "Loire",                           note: "Le jardin de la France : chenin, sauvignon et cabernet franc." },
  { slug: "loire-pouilly-fume",     nom: "Loire / Pouilly-Fumé",            note: "Le sauvignon sur silex, tendu, fumé et racé." },
  { slug: "maroc",                  nom: "Maroc",                           note: "Les vins de l'Atlas, chaleureux et épicés, une belle découverte." },
  { slug: "nord-pas-de-calais",     nom: "Nord-Pas-de-Calais",              note: "Une viticulture renaissante, curieuse et pleine d'avenir." },
  { slug: "normandie",              nom: "Normandie",                       note: "Des vins nordiques et singuliers, entre falaises et bocage." },
  { slug: "pas-de-calais",          nom: "Pas-de-Calais",                   note: "Les nouveaux coteaux de la Côte d'Opale, vifs et salins." },
  { slug: "provence",               nom: "Provence",                        note: "Rosés lumineux et rouges solaires, entre mer, garrigue et collines." },
  { slug: "vallee-du-rhone",        nom: "Vallée du Rhône",                 note: "Syrah au nord, grenache au sud : des vins généreux et épicés." },
  { slug: "vin-de-france",          nom: "Vin de France",                   note: "La liberté des vignerons, hors des sentiers battus." }
];

VDC.CATEGORIES = [
  { slug: "fines-bulles", nom: "Fines bulles", court: "Bulles",  teinte: ["#cfb27a", "#7d5f2e"], robe: "Or & perles", note: "Champagnes et crémants pour célébrer chaque instant." },
  { slug: "vins-bio",     nom: "Vins bio",     court: "Bio",     teinte: ["#8c9a5e", "#38431c"], robe: "Nature",      note: "Des vignerons engagés, respectueux de la vigne et du vivant." },
  { slug: "vins-blancs",  nom: "Vins blancs",  court: "Blancs",  teinte: ["#dccb8e", "#8a7838"], robe: "Or pâle",     note: "De la fraîcheur minérale aux blancs amples et gourmands." },
  { slug: "vins-roses",   nom: "Vins rosés",   court: "Rosés",   teinte: ["#e6a99a", "#9c4f45"], robe: "Pétale",      note: "L'art de vivre en rose, de l'apéritif à la table d'été." },
  { slug: "vins-rouges",  nom: "Vins rouges",  court: "Rouges",  teinte: ["#8a2a3a", "#2b0c12"], robe: "Grenat",      note: "Des rouges de copains aux grands vins de garde." }
];

VDC.CONSOMMATIONS = [
  { slug: "plaisir-immediat", nom: "Plaisir immédiat",   horizon: "Dès aujourd'hui", note: "Prêt à déboucher : le vin est à son meilleur dès maintenant." },
  { slug: "attendre-2-3-ans", nom: "Attendre 2 à 3 ans", horizon: "2 à 3 ans",       note: "Un peu de patience : quelques années lui donneront sa pleine harmonie." },
  { slug: "belle-garde",      nom: "Belle garde",        horizon: "5 à 10 ans",      note: "Une belle structure qui saura évoluer avec grâce au fil des ans." },
  { slug: "a-mettre-en-cave", nom: "À mettre en cave",   horizon: "10 ans et plus",  note: "Un grand vin de garde à oublier en cave pour le révéler un jour." }
];

/* --------------------------------------------------------------------------
   PRODUITS — vide pour l'instant (châssis du site, sans images).
   Le catalogue complet du site actuel (photo, titre et prix de chaque
   bouteille) est enregistré dans donnees/catalogue-vinsdecopains.json
   et donnees/catalogue-vinsdecopains.csv ; les photos sont dans
   assets/bouteilles/. Les bouteilles seront placées ici, dans leur
   région et leur catégorie, à l'étape suivante.

   Format d'une bouteille :
   { id: "saint-joseph-gripa-2022", nom: "SAINT JOSEPH Domaine Bernard GRIPA 2022",
     prix: 31.80, image: "assets/bouteilles/saint-joseph-domaine-bernard-gripa-2022.jpg",
     region: "vallee-du-rhone", categories: ["vins-rouges"], consommation: "plaisir-immediat" }
   -------------------------------------------------------------------------- */
VDC.PRODUITS = [];
