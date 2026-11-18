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
   NOS VIGNERONS — repris de la carte Google du site actuel
   (« Carte des vignerons de www.vinsdecopains.com »).
   lat / lon : position du domaine ; note : le mot du caviste.
   VIGNOBLES : ordre d'affichage et lien vers la région dans « Nos vins ».
   -------------------------------------------------------------------------- */
VDC.VIGNOBLES = [
  { nom: "Champagne", region: "champagne" },
  { nom: "Normandie", region: "normandie" },
  { nom: "Loire", region: "loire" },
  { nom: "Loire / Pouilly-Fumé", region: "loire-pouilly-fume" },
  { nom: "Bourgogne", region: "bourgogne" },
  { nom: "Jura" },
  { nom: "Beaujolais", region: "beaujolais" },
  { nom: "Côte Roannaise", region: "cote-roannaise" },
  { nom: "Vallée du Rhône", region: "vallee-du-rhone" },
  { nom: "Bordeaux", region: "bordeaux" },
  { nom: "Sud-Ouest" },
  { nom: "Côtes de Gascogne", region: "cotes-de-gascogne" },
  { nom: "Languedoc-Roussillon", region: "languedoc" },
  { nom: "Provence", region: "provence" },
  { nom: "Bandol", region: "bandol" },
  { nom: "Corse", region: "corse" }
];

VDC.VIGNERONS = [
  { nom: "Champagne Billecart-Salmon", vignoble: "Champagne", lat: 49.0459, lon: 4.0364 },
  { nom: "Champagne Deutz", vignoble: "Champagne", lat: 49.0567, lon: 4.0039 },
  { nom: "Champagne Drappier", vignoble: "Champagne", lat: 48.1696, lon: 4.653 },
  { nom: "Champagne Jean-Noël Haton", vignoble: "Champagne", lat: 49.07, lon: 3.8819, note: "Extra rapport qualite prix pour le Brut Classic" },
  { nom: "Champagne Krug", vignoble: "Champagne", lat: 49.2611, lon: 4.0363 },
  { nom: "Champagne Lallier", vignoble: "Champagne", lat: 49.0553, lon: 4.006, note: "Des cuvées composées d'une majorité de vins d'un millésime. Très belles bouteilles à prix sage. Elles ont tout des grandes..." },
  { nom: "Champagne Le Brun de Neuville", vignoble: "Champagne", lat: 48.6109, lon: 3.6242, note: "Jolie gamme de Champagnes, dont \"côte Blanche\" un 100% Chardonnay au super rapport qualité prix." },
  { nom: "Champagne Veuve Clicquot", vignoble: "Champagne", lat: 49.2597, lon: 4.0345 },
  { nom: "Moët & Chandon – Dom Pérignon", vignoble: "Champagne", lat: 49.0811, lon: 3.9417 },
  { nom: "Éric Bordelet", vignoble: "Normandie", lat: 48.4258, lon: -0.3963 },
  { nom: "Alphonse Mellot", vignoble: "Loire", lat: 47.3323, lon: 2.8406, note: "Sancerre blanc et rouge de haute volée" },
  { nom: "Clos Saint Fiacre", vignoble: "Loire", lat: 47.8468, lon: 1.8007, note: "Bienvenue chez les Montigny-Piel AOC Orléans et Orléans Cléry. Passionnés par le vin et toujours curieux de se régaler des vins des confrères." },
  { nom: "Domaine Denizot", vignoble: "Loire", lat: 47.3451, lon: 2.8104, note: "Sancerre blancs et rouges" },
  { nom: "Domaine Grosbois", vignoble: "Loire", lat: 47.1513, lon: 0.3808 },
  { nom: "Domaine Octavie", vignoble: "Loire", lat: 47.3941, lon: 1.355 },
  { nom: "Domaine Ogereau", vignoble: "Loire", lat: 47.2996, lon: -0.6347 },
  { nom: "Domaine de la Taille aux Loups", vignoble: "Loire", lat: 47.3907, lon: 0.8831, note: "Des vins effervescents ou tranquilles de très belle qualité." },
  { nom: "Domaine des Roches Neuves", vignoble: "Loire", lat: 47.2233, lon: -0.0643, note: "Thierry Germain nous régale avec son Saumur Champigny concentré et soyeux. Un passionné comme on les aime." },
  { nom: "Julien et Clément Raimbault", vignoble: "Loire", lat: 47.3614, lon: 2.8007 },
  { nom: "Domaine Masson-Blondelet", vignoble: "Loire / Pouilly-Fumé", lat: 47.2852, lon: 2.9544 },
  { nom: "Domaine des Rabichattes", vignoble: "Loire / Pouilly-Fumé", lat: 47.304, lon: 2.9268 },
  { nom: "Domaine du Bouchot", vignoble: "Loire / Pouilly-Fumé", lat: 47.2943, lon: 2.9737, note: "Pouilly fumé de grand caractère;" },
  { nom: "Jonathan Didier Pabiot", vignoble: "Loire / Pouilly-Fumé", lat: 47.3031, lon: 2.9294 },
  { nom: "Château de Beauregard – Joseph Burrier", vignoble: "Bourgogne", lat: 46.2901, lon: 4.7506 },
  { nom: "Clos des Rocs", vignoble: "Bourgogne", lat: 46.2766, lon: 4.7662, note: "Olivier GIROUX pour le Clos des Rocs" },
  { nom: "Domaine Boisson Vadot", vignoble: "Bourgogne", lat: 46.9746, lon: 4.7671, note: "Bourgogne, Meursault, Pommard, Monthélie, Auxey duresses...." },
  { nom: "Domaine François Mikulski", vignoble: "Bourgogne", lat: 46.9732, lon: 4.7829, note: "Les vins magnifiques de ce domaine." },
  { nom: "Domaine François Raquillet", vignoble: "Bourgogne", lat: 46.8395, lon: 4.7204 },
  { nom: "Domaine Hubert Lamy", vignoble: "Bourgogne", lat: 46.9491, lon: 4.7091 },
  { nom: "Domaine Huguenot Père et Fils", vignoble: "Bourgogne", lat: 47.2689, lon: 4.9858 },
  { nom: "Domaine Joblot", vignoble: "Bourgogne", lat: 46.782, lon: 4.7435, note: "Gamme de 1er cru en rouge et en blanc. La finesse et la gourmandise !" },
  { nom: "Domaine Leroy", vignoble: "Bourgogne", lat: 46.9857, lon: 4.7469 },
  { nom: "Domaine Leroy – Vosne-Romanée", vignoble: "Bourgogne", lat: 47.1558, lon: 4.9559, note: "C'est de l'unique, de l'exclusif." },
  { nom: "Domaine Michèle et Patrice Rion", vignoble: "Bourgogne", lat: 47.1131, lon: 4.9335 },
  { nom: "Domaine Parigot Père et Fils", vignoble: "Bourgogne", lat: 47.0303, lon: 4.7346 },
  { nom: "Domaine Pattes Loup", vignoble: "Bourgogne", lat: 47.7745, lon: 3.7553, note: "Grands vins de Chablis thomas PICO. Chablis \"vent d'ange\" ainsi que ses 1er crus. Quantités très limitées. sniff" },
  { nom: "Domaine Philippe Cordonnier", vignoble: "Bourgogne", lat: 47.0869, lon: 4.9058 },
  { nom: "Domaine Vincent Dureuil-Janthial", vignoble: "Bourgogne", lat: 46.875, lon: 4.7481 },
  { nom: "Domaine de la Meulière", vignoble: "Bourgogne", lat: 47.8151, lon: 3.8613 },
  { nom: "La Sœur Cadette", vignoble: "Bourgogne", lat: 47.4632, lon: 3.7692, note: "Vins dans l'air du temps, fraicheur et gourmandise." },
  { nom: "Les Héritiers du Comte Lafon", vignoble: "Bourgogne", lat: 46.3501, lon: 4.6963, note: "Délicieux Macon en biodynamie" },
  { nom: "Maison Louis Jadot", vignoble: "Bourgogne", lat: 47.0378, lon: 4.8408, note: "Une référence dans la Bourgogne, on a sélectionné leur BOUZERON" },
  { nom: "Samuel Billaud", vignoble: "Bourgogne", lat: 47.8141, lon: 3.7998, note: "Tout ce qu'on aime dans le Chablis" },
  { nom: "Domaine Jacques Tissot", vignoble: "Jura", lat: 46.9033, lon: 5.7735 },
  { nom: "Château du Moulin-à-Vent", vignoble: "Beaujolais", lat: 46.2051, lon: 4.7248 },
  { nom: "Domaine Jean-Marc Burgaud", vignoble: "Beaujolais", lat: 46.1471, lon: 4.6826 },
  { nom: "Domaine Louis-Claude Desvignes", vignoble: "Beaujolais", lat: 46.1638, lon: 4.6821 },
  { nom: "Domaine des Pothiers", vignoble: "Côte Roannaise", lat: 45.9991, lon: 3.9526, note: "Des cuvées précises et gourmandes." },
  { nom: "Bastide Saint-Dominique", vignoble: "Vallée du Rhône", lat: 44.0849, lon: 4.8601 },
  { nom: "Château de Saint Cosme", vignoble: "Vallée du Rhône", lat: 44.167, lon: 5.0061, note: "Notre Côtes du Rhône parfait pour toutes les occasions. Des cuvées très accessibles et d'autres plus complexes. On se régale." },
  { nom: "Clos de l'Oratoire des Papes", vignoble: "Vallée du Rhône", lat: 44.0572, lon: 4.8351, note: "Des vins puissants et réjouissants !" },
  { nom: "Domaine Bernard Gripa", vignoble: "Vallée du Rhône", lat: 45.0385, lon: 4.8304 },
  { nom: "Domaine Combier", vignoble: "Vallée du Rhône", lat: 45.0219, lon: 4.8689, note: "Délicieusement accessibles !" },
  { nom: "Domaine François Villard", vignoble: "Vallée du Rhône", lat: 45.4436, lon: 4.7347, note: "On est dans dans de bonnes mains... Excellent Saint Joseph, pour ne citer que lui" },
  { nom: "Domaine Les Cailloux", vignoble: "Vallée du Rhône", lat: 44.0227, lon: 4.845 },
  { nom: "Domaine Mayard", vignoble: "Vallée du Rhône", lat: 44.0554, lon: 4.8339, note: "La finesse et l'excellence" },
  { nom: "Domaine de Fondrèche", vignoble: "Vallée du Rhône", lat: 44.0827, lon: 5.1351, note: "Des vins \"identiterres\" plein de vie et de gourmandise. C'est un coup de coeur rapport qualité prix." },
  { nom: "Domaine de la Citadelle", vignoble: "Vallée du Rhône", lat: 43.8442, lon: 5.1972, note: "Blanc \"court métrage\" très sympathique. Fraicheur et volupté." },
  { nom: "Domaine de la Solitude", vignoble: "Vallée du Rhône", lat: 44.0555, lon: 4.8514 },
  { nom: "Domaine des Romarins", vignoble: "Vallée du Rhône", lat: 43.9303, lon: 4.6491 },
  { nom: "Domaine du Tunnel – Stéphane Robert", vignoble: "Vallée du Rhône", lat: 44.9461, lon: 4.8446 },
  { nom: "Domaine du Vieux Télégraphe", vignoble: "Vallée du Rhône", lat: 44.0429, lon: 4.8851 },
  { nom: "Julien Pilon", vignoble: "Vallée du Rhône", lat: 45.4684, lon: 4.7726, note: "Y a des gars comme ça, quand ils maitrisent leur sujet ils sont bons. Délicieux Viognier et Saint Joseph." },
  { nom: "Vignobles Marrenon", vignoble: "Vallée du Rhône", lat: 43.7236, lon: 5.542, note: "Une gamme au surprenant rapport qualité Prix" },
  { nom: "Yves Cuilleron", vignoble: "Vallée du Rhône", lat: 45.4331, lon: 4.743, note: "Syrah et autres Condrieu ..." },
  { nom: "Château Barrail Saint-André", vignoble: "Bordeaux", lat: 44.8792, lon: -0.0946 },
  { nom: "Château Belles Graves", vignoble: "Bordeaux", lat: 44.9398, lon: -0.1919, note: "C'est la que nous avons déniché ce Lalande de Pomerol à l'excellent rapport qualité plaisir prix." },
  { nom: "Château Clos de Boüard", vignoble: "Bordeaux", lat: 44.9135, lon: -0.1024 },
  { nom: "Château Escot", vignoble: "Bordeaux", lat: 45.2929, lon: -0.9365, note: "Très beau Médoc que ce Château  ESCOT. Quand le classique a tout bon." },
  { nom: "Château Lagrange", vignoble: "Bordeaux", lat: 45.1495, lon: -0.7732 },
  { nom: "Château Martet", vignoble: "Bordeaux", lat: 44.811, lon: 0.1579 },
  { nom: "Ets Thunevin", vignoble: "Bordeaux", lat: 44.8951, lon: -0.1552, note: "Faut t'il présenter JL THUNEVIN ce Bad boy de St Emilion à la tête du superbe Château VALANDRAUD, initiateur des vins de garage." },
  { nom: "La Bécasse", vignoble: "Bordeaux", lat: 45.2022, lon: -0.7497, note: "Listrac Médoc vinifié dans le Chai de PAUILLAC. Belles matières et savoir faire. Prix raisonnable." },
  { nom: "Marius Bielle", vignoble: "Bordeaux", lat: 44.9558, lon: -0.2109, note: "Magnifiques vins par Marius BIELLE qui nous propose entre autre son Lalande de Pomerol \"BRUT (E)\"" },
  { nom: "Château Tirecul La Gravière", vignoble: "Sud-Ouest", lat: 44.801, lon: 0.4765 },
  { nom: "Domaine du Moncaut", vignoble: "Sud-Ouest", lat: 43.3871, lon: -0.4422, note: "Sophie et Thibaud de Salettes" },
  { nom: "Domaine Chiroulet", vignoble: "Côtes de Gascogne", lat: 43.9927, lon: 0.2861, note: "De superbes cuvées comme ce rouge Grande Réserve au super rapport plaisir / plaisir (le prix n'est pas mal non plus)" },
  { nom: "Château d'Anglès", vignoble: "Languedoc-Roussillon", lat: 43.2187, lon: 3.1875, note: "Des vins plein de soleil. Elaborés par la famille FAVRE qui a fait ses armes dans les grands Domaines de renom sur Pauillac." },
  { nom: "Château de Valflaunès", vignoble: "Languedoc-Roussillon", lat: 43.8002, lon: 3.8732, note: "Que ça soit en Blanc ou en rouge, notre coeur fait BOOM !" },
  { nom: "Clos Marie", vignoble: "Languedoc-Roussillon", lat: 43.8346, lon: 3.8835 },
  { nom: "Domaine Gayda", vignoble: "Languedoc-Roussillon", lat: 43.1202, lon: 2.1633 },
  { nom: "Domaine Mirmanda", vignoble: "Languedoc-Roussillon", lat: 42.6438, lon: 2.6244, note: "Les vins de FX DEMAISON et Dominique LAPORTE." },
  { nom: "Domaine de la Rectorie", vignoble: "Languedoc-Roussillon", lat: 42.4789, lon: 3.1264 },
  { nom: "Domaine du Clos des Fées", vignoble: "Languedoc-Roussillon", lat: 42.8498, lon: 2.7767, note: "Superbe bouteille que ces Sorcières, pour des plaisirs partagés entre copains." },
  { nom: "Domaine l'Aiguelière", vignoble: "Languedoc-Roussillon", lat: 43.6849, lon: 3.5154 },
  { nom: "Château Galoupet", vignoble: "Provence", lat: 43.1326, lon: 6.1988 },
  { nom: "Château Les Valentines", vignoble: "Provence", lat: 43.1504, lon: 6.2275, note: "Un domaine découvert lors d'un diner au restaurant en Provence. On est fan de la cuvée Bagnard." },
  { nom: "Château d'Ollières", vignoble: "Provence", lat: 43.4837, lon: 5.8302, note: "Le Château est superbe et le rosé même dégusté dans le Ch'Nord est superbe. rosé pale charmeur." },
  { nom: "Domaine Richeaume", vignoble: "Provence", lat: 43.5095, lon: 5.6469, note: "Élégant élevage avec ce qu'i faut de bois noble. Gourmandise assurée." },
  { nom: "Domaine Tempier", vignoble: "Bandol", lat: 43.1835, lon: 5.7728, note: "Magnifiques vins très gourmands en rouge et en blanc." },
  { nom: "Domaine Comte Abbatucci", vignoble: "Corse", lat: 41.7725, lon: 8.9089, note: "A découvrir la cuvée FAUSTINE !" },
  { nom: "Domaine Yves Leccia", vignoble: "Corse", lat: 42.668, lon: 9.346 }
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
