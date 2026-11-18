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
  { slug: "fines-bulles", nom: "Fines bulles", court: "Bulles",  image: "assets/img/cat-fines-bulles.jpg", note: "Champagnes et crémants pour célébrer chaque instant." },
  { slug: "vins-bio",     nom: "Vins bio",     court: "Bio",     image: "assets/img/cat-vins-bio.jpg",     note: "Des vignerons engagés, respectueux de la vigne et du vivant." },
  { slug: "vins-blancs",  nom: "Vins blancs",  court: "Blancs",  image: "assets/img/cat-vins-blancs.jpg",  note: "De la fraîcheur minérale aux blancs amples et gourmands." },
  { slug: "vins-roses",   nom: "Vins rosés",   court: "Rosés",   image: "assets/img/cat-vins-roses.jpg",   note: "L'art de vivre en rose, de l'apéritif à la table d'été." },
  { slug: "vins-rouges",  nom: "Vins rouges",  court: "Rouges",  image: "assets/img/cat-vins-rouges.jpg",  note: "Des rouges de copains aux grands vins de garde." }
];

VDC.CONSOMMATIONS = [
  { slug: "plaisir-immediat", nom: "Plaisir immédiat",   horizon: "Dès aujourd'hui", note: "Prêt à déboucher : le vin est à son meilleur dès maintenant." },
  { slug: "attendre-2-3-ans", nom: "Attendre 2 à 3 ans", horizon: "2 à 3 ans",       note: "Un peu de patience : quelques années lui donneront sa pleine harmonie." },
  { slug: "belle-garde",      nom: "Belle garde",        horizon: "5 à 10 ans",      note: "Une belle structure qui saura évoluer avec grâce au fil des ans." },
  { slug: "a-mettre-en-cave", nom: "À mettre en cave",   horizon: "10 ans et plus",  note: "Un grand vin de garde à oublier en cave pour le révéler un jour." }
];

/* --------------------------------------------------------------------------
   PRODUITS — catalogue repris du site actuel (www.vinsdecopains.com)
   173 vins : titre, prix, photo, région, catégories et consommation
   tels qu'indiqués sur le site actuel.
   « ref » = numéro du produit sur l'ancien site (PrestaShop).
   « selection: true » = affiché dans « Nos coups de cœur » sur l'accueil.
   « nouveau: true » = étiquette « Nouveau ».
   -------------------------------------------------------------------------- */
VDC.PRODUITS = [
  {
    id: "cote-de-provence-cuvee-bagnard-du-chateau-les-valentines-2016",
    ref: "9",
    nom: "COTE DE PROVENCE Cuvée Bagnard du Château Les VALENTINES 2016",
    prix: 28.50,
    image: "assets/bouteilles/cote-de-provence-cuvee-bagnard-du-chateau-les-valentines-2016.jpg",
    region: "provence",
    categories: ["vins-rouges", "vins-bio"],
    consommation: "plaisir-immediat",
    description: "Le dos courbé par le poids des paniers, le soleil qui cogne... merci aux valeureux vendangeurs qui depuis 2006 produisent cette belle cuvée."
  },
  {
    id: "champagne-deutz-rose-etui",
    ref: "118",
    nom: "CHAMPAGNE DEUTZ Rosé (étui)",
    prix: 59.90,
    image: "assets/bouteilles/champagne-deutz-rose-etui.jpg",
    region: "champagne",
    categories: ["fines-bulles"],
    consommation: "plaisir-immediat",
    description: "Le grand numéro de la Maison DEUTZ, on a la finesse de ce grand rosé"
  },
  {
    id: "champagne-cuvee-charles-de-gaulle-18-juin-maison-drappier-etui",
    ref: "136",
    nom: "CHAMPAGNE Cuvée Charles de Gaulle 18 juin Maison DRAPPIER (étui)",
    prix: 46.90,
    image: "assets/bouteilles/champagne-cuvee-charles-de-gaulle-18-juin-maison-drappier-etui.jpg",
    region: "champagne",
    categories: ["fines-bulles"],
    consommation: "plaisir-immediat",
    selection: true,
    description: "Une grande cuvée de Champagne crée en 1990 à l'occasion du cinquantenaire de l'appel du Général de Gaulle depuis Londres le 18 juin 1940. Un assemblage de la Maison DRAPPIER (Champagne auquel le Général fut un grand fidèle) de 80% de pinot Noir et de 20% de Chardonnay."
  },
  {
    id: "champagne-maison-deutz-brut-etui",
    ref: "7",
    nom: "CHAMPAGNE Maison DEUTZ Brut (étui)",
    prix: 44.90,
    image: "assets/bouteilles/champagne-maison-deutz-brut-etui.jpg",
    region: "champagne",
    categories: ["fines-bulles"],
    consommation: "plaisir-immediat",
    description: "DEUTZ ... il a du bonheur dans ces bouteilles ! et quel équilibre. C'est un des secret de la cuvée Classic de la Maison DEUTZ : 1/3 pour chacun : Chardonnay, Pinot Noir et Meunier. La régularité et l'équilibre à l'état pur."
  },
  {
    id: "bourgogne-marsannay-blanc-domaine-huguenot-2021",
    ref: "30",
    nom: "BOURGOGNE MARSANNAY Blanc Domaine HUGUENOT 2021",
    prix: 29.90,
    image: "assets/bouteilles/bourgogne-marsannay-blanc-domaine-huguenot-2021.jpg",
    region: "bourgogne",
    categories: ["vins-blancs"],
    consommation: "plaisir-immediat",
    description: "MARSANNAY Blanc du Domaine HUGUENOT, Bourgogne 100% Chardonnay. Boisé léger, ampleur sympathique."
  },
  {
    id: "saint-joseph-domaine-bernard-gripa-2022",
    ref: "159",
    nom: "SAINT JOSEPH Domaine Bernard GRIPA 2022",
    prix: 31.80,
    image: "assets/bouteilles/saint-joseph-domaine-bernard-gripa-2022.jpg",
    region: "vallee-du-rhone",
    categories: ["vins-rouges"],
    consommation: "plaisir-immediat",
    selection: true,
    description: "Encore un coup de coeur personnel pour ce Saint Joseph de Chez Bernard GRIPA. Désormais c'est son fils Fabrice qui est au commande de ce beau domaine de Mauves en Ardèche. Puissance et sérénité ai je envie de dire."
  },
  {
    id: "loire-pouilly-fume-cuvee-leon-par-jonathan-pabiot-2021",
    ref: "47",
    nom: "LOIRE POUILLY FUME Cuvée LEON Par Jonathan PABIOT 2021",
    prix: 29.80,
    image: "assets/bouteilles/loire-pouilly-fume-cuvee-leon-par-jonathan-pabiot-2021.jpg",
    region: "loire",
    categories: ["vins-blancs"],
    consommation: "plaisir-immediat",
    description: "Une véritable florilège (ancien nom de cette cuvée) vous allez adorer les vins de Jonathan PABIOT. Belle tension, Vous allez vous régaler."
  },
  {
    id: "crozes-hermitage-blanc-on-the-rhone-again-julien-pilon-2021",
    ref: "173",
    nom: "CROZES HERMITAGE Blanc \"On the Rhône again\" Julien PILON 2021",
    prix: 23.80,
    image: "assets/bouteilles/crozes-hermitage-blanc-on-the-rhone-again-julien-pilon-2021.jpg",
    region: "vallee-du-rhone",
    categories: ["vins-blancs"],
    consommation: "plaisir-immediat",
    selection: true,
    description: "Ok le nom est un peu Rock n Roll, mais le contenu c'est du sérieux. Un 100% Marsanne avec un boisé élégant car discret. Belle tension."
  },
  {
    id: "bourgogne-marsannay-domaine-huguenot-champs-perdrix-2021",
    ref: "65",
    nom: "BOURGOGNE MARSANNAY Domaine HUGUENOT Champs Perdrix 2021",
    prix: 35.90,
    image: "assets/bouteilles/bourgogne-marsannay-domaine-huguenot-champs-perdrix-2021.jpg",
    region: "bourgogne",
    categories: ["vins-rouges"],
    consommation: "plaisir-immediat",
    description: "Je ne suis pas toujours de fan de Pinot Noir mais là j'ai du me rendre à l'évidence...c'est bon, c'est élégant, bref une très belle bouteille à boire dès à présent et qui peut attendre quelques années (si vous savez)."
  },
  {
    id: "gigondas-chateau-de-st-cosme-2017",
    ref: "193",
    nom: "GIGONDAS Château de ST COSME 2017",
    prix: 31.60,
    image: "assets/bouteilles/gigondas-chateau-de-st-cosme-2017.jpg",
    region: "vallee-du-rhone",
    categories: ["vins-rouges", "vins-bio"],
    consommation: "a-mettre-en-cave",
    description: "Dans le Château de St Cosme je demande .... le Gigondas. Quelle puissance, une bouteille à ne pas mettre entre toutes les mains. Plaisir à partager."
  },
  {
    id: "bourgueil-le-haut-de-la-butte-2018-jacky-blot",
    ref: "89",
    nom: "BOURGUEIL Le haut de la Butte 2018 Jacky BLOT",
    prix: 20.80,
    image: "assets/bouteilles/bourgueil-le-haut-de-la-butte-2018-jacky-blot.jpg",
    region: "loire",
    categories: ["vins-rouges"],
    consommation: "plaisir-immediat",
    description: "Pour qui aime le Cabernet Franc quand il a de la matière... ne bougez plus vous avez trouvé. Jacky BLOT magnifie ce cépage qu'il adore et profite d'un superbe terroir sur ce coteau de Bourgueil."
  },
  {
    id: "cotes-de-provence-la-punition-bio-2017",
    ref: "200",
    nom: "CÔTES DE PROVENCE \"LA PUNITION\" BIO 2017",
    prix: 14.50,
    image: "assets/bouteilles/cotes-de-provence-la-punition-bio-2017.jpg",
    region: "provence",
    categories: ["vins-rouges"],
    consommation: "plaisir-immediat",
    selection: true,
    description: "La PUNITION pour nommer un vin ? Le Château les VALENTINES aime donner un nom qui a du sens à ses cuvées. Ici c'est pour rappeler la longue et difficile vendange 2010 d'une parcelle de vieux ceps de carignan plantés en 1945... parcelle sur laquelle les vendangeurs ont souffert de la chaleur, le dos courbé pour peu de raisins... Mais à la dégustation on leur dit MERCI ! Quelle gourmandise."
  },
  {
    id: "bordeaux-chateau-lafont-fourcat-a-nos-amours-blancs-2014",
    ref: "116",
    nom: "BORDEAUX Château Lafont Fourcat A nos Amours BLANCS 2014",
    prix: 12.50,
    image: "assets/bouteilles/bordeaux-chateau-lafont-fourcat-a-nos-amours-blancs-2014.jpg",
    region: "bordeaux",
    categories: ["vins-blancs"],
    consommation: "plaisir-immediat",
    description: "Domaine LAFONT FOURCAT, dont JL Thunevin (encore lui) est consultant. Vin blanc sec qui avec les années s'est un peu adouci. Ça reste un vin agréable, moins sec. A boire."
  },
  {
    id: "cotes-catalanes-au-dolmen-mas-llossanes-2016",
    ref: "212",
    nom: "COTES CATALANES Au DOLMEN Mas LLOSSANES 2016",
    prix: 16.90,
    image: "assets/bouteilles/cotes-catalanes-au-dolmen-mas-llossanes-2016.jpg",
    region: "languedoc",
    categories: ["vins-rouges"],
    consommation: "plaisir-immediat",
    description: "Une cuvée originale issue d'un travail minutieux des sols et de la vigne. Culture en Biodynamie, mais sans en faire un argument commercial. Elevage en cuve béton puis barriques."
  },
  {
    id: "champagne-amour-de-deutz-75cl-millesime-2013-coffret",
    ref: "218",
    nom: "CHAMPAGNE AMOUR DE DEUTZ 75cl millésime 2013 (coffret)",
    prix: 189.00,
    image: "assets/bouteilles/champagne-amour-de-deutz-75cl-millesime-2013-coffret.jpg",
    region: "champagne",
    categories: ["fines-bulles"],
    consommation: "plaisir-immediat",
    description: "On se fait un gros plaisir avec cette bouteille...que ça soit lors de la St VALENTIN ou pas..."
  },
  {
    id: "languedoc-chemin-de-moscou-dom-gayda-2022",
    ref: "147",
    nom: "LANGUEDOC CHEMIN DE MOSCOU Dom Gayda 2022",
    prix: 24.90,
    image: "assets/bouteilles/languedoc-chemin-de-moscou-dom-gayda-2022.jpg",
    region: "languedoc",
    categories: ["vins-rouges", "vins-bio"],
    consommation: "attendre-2-3-ans",
    selection: true,
    description: "Un très beau vin tout en puissance et très expressif. Le fleuron du domaine Gayda en Languedoc (domaine travaillant en BIO, ca va sans dire mais ca va mieux en le disant)."
  },
  {
    id: "saumur-cuvee-amphore-terres-par-thierry-germain-2019",
    ref: "222",
    nom: "SAUMUR Cuvée Amphore TERRES Par Thierry GERMAIN 2019",
    prix: 52.90,
    image: "assets/bouteilles/saumur-cuvee-amphore-terres-par-thierry-germain-2019.jpg",
    region: "loire",
    categories: ["vins-blancs", "vins-bio"],
    consommation: "a-mettre-en-cave",
    description: "Ce vin est un OVNI avec cette macération sur peau en Amphore pour presque 9 mois... Puis élevage en fûts pour une année. Thierry GERMAIN sait prendre soin de ses vins, les ciseller pour qu'ils soient nets."
  },
  {
    id: "loire-anjou-coteaux-du-layon-st-lambert-dom-ogereau-2016",
    ref: "185",
    nom: "LOIRE ANJOU Coteaux du Layon St Lambert Dom OGEREAU 2016",
    prix: 17.40,
    image: "assets/bouteilles/loire-anjou-coteaux-du-layon-st-lambert-dom-ogereau-2016.jpg",
    region: "loire",
    categories: ["vins-blancs"],
    consommation: "",
    selection: true,
    description: "Que celui qui n'a jamais craqué sur un coteaux du Layon lève le doigt... Franchement, cette douceur, ces parfums ça ne peut que vous séduire sur un apéritif ou un foie gras. Le chenin est ici récolté à surmaturité et livre ses parfums très rapidement et sans lourdeur."
  },
  {
    id: "igp-mediterranee-columelle-dom-richeaume-2020",
    ref: "225",
    nom: "IGP Méditerranée COLUMELLE Dom RICHEAUME 2020",
    prix: 28.90,
    image: "assets/bouteilles/igp-mediterranee-columelle-dom-richeaume-2020.jpg",
    region: "provence",
    categories: ["vins-blancs", "vins-bio"],
    consommation: "plaisir-immediat",
    description: "La belle bouteille que cette cuvée COLUMELLE. Ampleur et fraîcheur ! Une bouteille gastronomique."
  },
  {
    id: "loire-sancerre-dom-du-pre-semele-julien-et-clement-raimbault-2022",
    ref: "187",
    nom: "LOIRE SANCERRE Dom du Pré Semelé Julien et Clément RAIMBAULT 2022",
    prix: 22.80,
    image: "assets/bouteilles/loire-sancerre-dom-du-pre-semele-julien-et-clement-raimbault-2022.jpg",
    region: "loire",
    categories: ["vins-blancs"],
    consommation: "plaisir-immediat",
    description: "C'est un domaine de 20 hectares à 5Km de la ville de SANCERRE. Les deux frères Clément et Julien jouent la simplicité, la pureté dans le respect de ce sublime terroir. Pour ce Sancerre on est dans sa pure expression. On aime beaucoup."
  },
  {
    id: "igp-mediterranee-cuvee-tradition-dom-richeaume-2022",
    ref: "226",
    nom: "IGP Méditerranée Cuvée TRADITION Dom RICHEAUME 2022",
    prix: 21.90,
    image: "assets/bouteilles/igp-mediterranee-cuvee-tradition-dom-richeaume-2022.jpg",
    region: "provence",
    categories: ["vins-rouges", "vins-bio"],
    consommation: "plaisir-immediat",
    description: "Une bouteille qui diffuse de la joie autour d'elle. Des parfums, des arômes, tout y est !"
  },
  {
    id: "mirmanda-blanc-cotes-du-roussillon-2020",
    ref: "203",
    nom: "MIRMANDA Blanc Côtes du Roussillon 2020",
    prix: 47.90,
    image: "assets/bouteilles/mirmanda-blanc-cotes-du-roussillon-2020.jpg",
    region: "languedoc",
    categories: ["vins-blancs", "vins-bio"],
    consommation: "plaisir-immediat",
    description: "Magnifique bouteille que ce MIRMANDA blanc. Les quantités sont inversement proportionnelles aux qualités de ce vin blanc."
  },
  {
    id: "bandol-domaine-tempier-blanc-2019",
    ref: "230",
    nom: "BANDOL Domaine TEMPIER Blanc 2019",
    prix: 29.80,
    image: "assets/bouteilles/bandol-domaine-tempier-blanc-2019.jpg",
    region: "bandol",
    categories: ["vins-blancs"],
    consommation: "plaisir-immediat",
    description: "L'unique blanc du domaine, un assemblage généreux de Clairette et Ugni blanc. Une belle fraîcheur matrisée pour ce vin \"plein Sud\"."
  },
  {
    id: "bandol-domaine-tempier-rouge-classique-2021",
    ref: "231",
    nom: "BANDOL Domaine TEMPIER Rouge Classique 2021",
    prix: 38.90,
    image: "assets/bouteilles/bandol-domaine-tempier-rouge-classique-2021.jpg",
    region: "bandol",
    categories: ["vins-rouges"],
    consommation: "plaisir-immediat",
    description: "Magnifique domaine et Magnifique cuvée que ce Rouge Classique \"LULU & LUCIEN\". Tout le charme des vins du SUD y est."
  },
  {
    id: "saumur-blanc-clos-du-moulin-par-thierry-germain-2019",
    ref: "221",
    nom: "SAUMUR Blanc CLOS DU MOULIN par Thierry Germain 2019",
    prix: 37.90,
    image: "assets/bouteilles/saumur-blanc-clos-du-moulin-par-thierry-germain-2019.jpg",
    region: "loire",
    categories: ["vins-blancs", "vins-bio"],
    consommation: "a-mettre-en-cave",
    description: "Cuvée rare élaborée par Thierry GERMAIN en 100% Chenin (on est dans la région et toujours en mono-cépage). C'est droit, c'est vif, certains diront \"cisellé\" enfin bref c'est très très bon."
  },
  {
    id: "st-joseph-blanc-francois-villard-fruit-d-avilleran-2022",
    ref: "235",
    nom: "ST JOSEPH Blanc François VILLARD Fruit d'Avilleran 2022",
    prix: 24.80,
    image: "assets/bouteilles/st-joseph-blanc-francois-villard-fruit-d-avilleran-2022.jpg",
    region: "vallee-du-rhone",
    categories: ["vins-blancs"],
    consommation: "plaisir-immediat",
    description: "Ce St JOSEPH blanc 100 % Marsanne bien sûr va vous régaler avec cette belle alliance d'un joli gras et d'une belle fraîcheur."
  },
  {
    id: "crozes-hermitage-francois-villard-certitude-2021",
    ref: "237",
    nom: "CROZES HERMITAGE François VILLARD Certitude 2021",
    prix: 23.90,
    image: "assets/bouteilles/crozes-hermitage-francois-villard-certitude-2021.jpg",
    region: "vallee-du-rhone",
    categories: ["vins-rouges"],
    consommation: "plaisir-immediat",
    description: "Vous l'aurez sans doute remarqué on est fan de SYRAH. Alors quand c'est très bien fait on croque dans les raisins gorgés de soleil."
  },
  {
    id: "maroc-tandem-syrah-2021-alain-graillot",
    ref: "194",
    nom: "MAROC TANDEM Syrah 2021/ Alain GRAILLOT",
    prix: 16.90,
    image: "assets/bouteilles/maroc-tandem-syrah-2021-alain-graillot.jpg",
    region: "maroc",
    categories: ["vins-rouges"],
    consommation: "plaisir-immediat",
    description: "Belle surprise dans la bouteille avec de Syrah. D'un autre côté l'alliance du Vigneron Alain GRAILLOT (assez connu en Crozes Hermitage) et de Jacques POULAIN (oenologue Bordelais qui a posé ses valises quelques temps au pays des orangers) était rassurant, mais la surprise est belle. Gourmandise, pas de lourdeur, suave, épicée. On en redemande."
  },
  {
    id: "beaujolais-saint-amour-jean-paul-brun-2020",
    ref: "243",
    nom: "BEAUJOLAIS SAINT AMOUR Jean Paul BRUN 2020",
    prix: 18.70,
    image: "assets/bouteilles/beaujolais-saint-amour-jean-paul-brun-2020.jpg",
    region: "beaujolais",
    categories: ["vins-rouges"],
    consommation: "plaisir-immediat",
    description: "Saint Amour en BEAUJOLAIS, parmi les 10 crus, sans doute le plus charmeur à partager..."
  },
  {
    id: "champagne-le-brun-de-neuville-cote-blanche-brut-etui",
    ref: "245",
    nom: "CHAMPAGNE LE BRUN DE NEUVILLE Côte Blanche Brut (Etui)",
    prix: 35.90,
    image: "assets/bouteilles/champagne-le-brun-de-neuville-cote-blanche-brut-etui.jpg",
    region: "champagne",
    categories: ["fines-bulles"],
    consommation: "plaisir-immediat",
    description: "Un MAGNIFIQUE 100% Chardonnay que ce CÔTE BLANCHE. Un prix de copain pour un GRAND Champagne ! C'est tout l'esprit de vinsdecopains ! Santé Un conseil : faites vous plaisir avec \"l'autre côte\" à moins de 40€ et étonnez vos copains avec ce blanc de blancs qui a tout d'un grand."
  },
  {
    id: "cotes-catalanes-roc-des-anges-cuvee-chamade-2020",
    ref: "249",
    nom: "COTES CATALANES Roc des ANGES Cuvée CHAMADE 2020",
    prix: 21.90,
    image: "assets/bouteilles/cotes-catalanes-roc-des-anges-cuvee-chamade-2020.jpg",
    region: "languedoc",
    categories: ["vins-blancs", "vins-bio"],
    consommation: "plaisir-immediat",
    description: "Vin blanc franc et direct au joli gras. Très belle bouteille issue d'un parcelle sur Shistes de \"petit muscat\". Ca reste un blanc sec très agréable à l'apéritif pouvant se poursuivre sur l'entrée."
  },
  {
    id: "champigny-cuvee-amphore-outre-terre-par-thierry-germain-2019",
    ref: "223",
    nom: "CHAMPIGNY Cuvée Amphore OUTRE TERRE Par Thierry GERMAIN 2019",
    prix: 42.90,
    image: "assets/bouteilles/champigny-cuvee-amphore-outre-terre-par-thierry-germain-2019.jpg",
    region: "loire",
    categories: ["vins-rouges", "vins-bio"],
    consommation: "a-mettre-en-cave",
    description: "Un peu un OVNI ce vin. Macération de presque 9 mois en Amphore puis élevage en fût sur 12 mois. Aucun souffre, aucune filtration. C'est éclatant !"
  },
  {
    id: "loire-saumur-thierry-germain-l-insolite-2023",
    ref: "23",
    nom: "LOIRE SAUMUR Thierry GERMAIN L'INSOLITE 2023",
    prix: 23.80,
    image: "assets/bouteilles/loire-saumur-thierry-germain-l-insolite-2023.jpg",
    region: "loire",
    categories: ["vins-blancs", "vins-bio"],
    consommation: "plaisir-immediat",
    description: "Thierry GERMAIN signe ici un Saumur Blanc 100% Chenin. Toujours en vendanges manuelles et certifié AB, on est sur un terroir de grès et de silex."
  },
  {
    id: "morgon-cote-du-py-javernieres-les-impenitents-2020-louis-claude-desvignes",
    ref: "210",
    nom: "MORGON Côte du PY, Javernières LES IMPENITENTS 2020 Louis Claude DESVIGNES",
    prix: 89.80,
    image: "assets/bouteilles/morgon-cote-du-py-javernieres-les-impenitents-2020-louis-claude-desvignes.jpg",
    region: "beaujolais",
    categories: ["vins-rouges"],
    consommation: "a-mettre-en-cave",
    description: "La bombe atomique, une perle rare, une bouteille qui se mérite. D'ailleurs quantités très limitées et production ZERO sur 2021... C'est en effet très très bon, vous allez vous régaler mais patience il lui faudra quelques années de cave pour en profiter au mieux. UNE, DEUX ou TROIS bouteilles par commande maximum."
  },
  {
    id: "saint-peray-les-figuiers-bernard-gripa-2022",
    ref: "261",
    nom: "SAINT PERAY Les FIGUIERS Bernard Gripa 2022",
    prix: 31.50,
    image: "assets/bouteilles/saint-peray-les-figuiers-bernard-gripa-2022.jpg",
    region: "vallee-du-rhone",
    categories: ["vins-blancs"],
    consommation: "plaisir-immediat",
    description: "La cuvée les figuiers est un assemblage à 50/50 de Roussane et de Marsanne. Elevage en fût pour un boisé élégant. Un must !"
  },
  {
    id: "bourgogne-chablis-1er-cru-beauregard-par-thomas-pico-2018",
    ref: "79",
    nom: "BOURGOGNE CHABLIS 1er cru BEAUREGARD Par Thomas PICO 2018",
    prix: 62.90,
    image: "assets/bouteilles/bourgogne-chablis-1er-cru-beauregard-par-thomas-pico-2018.jpg",
    region: "bourgogne",
    categories: ["vins-blancs", "vins-bio"],
    consommation: "plaisir-immediat",
    description: "Chablis 1er cru BEAUREGARD par Thomas PICO. Les volumes sont très faibles, et notre allocation donc comme des glaçons dans le rosé (ah non pas ça :)"
  },
  {
    id: "loire-montlouis-brut-tradition-domaine-de-la-taille-aux-loups-jacky-blot",
    ref: "87",
    nom: "LOIRE / MONTLOUIS BRUT Tradition Domaine de la TAILLE AUX LOUPS Jacky BLOT",
    prix: 18.90,
    image: "assets/bouteilles/loire-montlouis-brut-tradition-domaine-de-la-taille-aux-loups-jacky-blot.jpg",
    region: "loire",
    categories: ["fines-bulles", "vins-bio"],
    consommation: "plaisir-immediat",
    description: "Jacky BLOT ne se fait pas mousser avec ce Brut tradition, mais autant dire que ca a du charme. Elevage en fûts de petite taille, ni levuré, ni chaptalisé. Une bulle fine et surprenante."
  },
  {
    id: "champagne-dom-perignon-2015-jean-michel-basquiat-etuit",
    ref: "257",
    nom: "CHAMPAGNE Dom PERIGNON 2015 Jean Michel BASQUIAT Etuit",
    prix: 249.00,
    image: "assets/bouteilles/champagne-dom-perignon-2015-jean-michel-basquiat-etuit.jpg",
    region: "champagne",
    categories: ["fines-bulles"],
    consommation: "plaisir-immediat",
    description: "On se fait le grand plaisir avec cette cuvée EXCEPTIONNELLE De DOM PERIGNON 2015 édition spéciale Jean Michel BASQUIAT en coffret original. Nous disposons de 3 graphismes différents. La ou les bouteilles seront placées dans votre colis de façon aléatoire. 3 bouteilles MAX par commande."
  },
  {
    id: "loire-clos-st-fiacre-rouge-excellence-2020",
    ref: "109",
    nom: "LOIRE Clos St Fiacre Rouge Excellence 2020",
    prix: 20.80,
    image: "assets/bouteilles/loire-clos-st-fiacre-rouge-excellence-2020.jpg",
    region: "loire",
    categories: ["vins-rouges"],
    consommation: "plaisir-immediat",
    selection: true,
    description: "Le Clos St Fiacre à 11km D'Orléans, des vins peu connus qui brillent par leur gourmandise et leur originalité. On croque dans ce vin de Loire qui travaille des cépages plus présents à l'EST."
  },
  {
    id: "saint-joseph-par-chateau-st-cosme-2020",
    ref: "154",
    nom: "SAINT JOSEPH Par Château ST COSME 2020",
    prix: 28.50,
    image: "assets/bouteilles/saint-joseph-par-chateau-st-cosme-2020.jpg",
    region: "vallee-du-rhone",
    categories: ["vins-rouges"],
    consommation: "plaisir-immediat",
    selection: true,
    description: "Le domaine ST COSME à Gigondas produit un ensemble de très beaux vins et le Saint Joseph ici sélectionné et une superbe bouteille."
  },
  {
    id: "montagne-saint-emilion-chateau-clos-de-bouard-2016",
    ref: "191",
    nom: "Montagne SAINT EMILION Château CLOS DE BOÜARD 2016",
    prix: 34.50,
    image: "assets/bouteilles/montagne-saint-emilion-chateau-clos-de-bouard-2016.jpg",
    region: "bordeaux",
    categories: ["vins-rouges"],
    consommation: "a-mettre-en-cave",
    selection: true,
    description: "Clos de Boüard fait parti des satellites de Saint Emilion comme on l'indique lorsque que les vignes sont sur la \"Montagne\". Tannins veloutés, bouche gourmande, que demander de plus ... ? Elevage un peu plus d'un an en barriques Neuves (30%)"
  },
  {
    id: "bourgogne-blanc-2025-domaine-la-soeur-cadette",
    ref: "263",
    nom: "BOURGOGNE blanc 2025 Domaine La Soeur Cadette",
    prix: 19.50,
    image: "assets/bouteilles/bourgogne-blanc-2025-domaine-la-soeur-cadette.jpg",
    region: "bourgogne",
    categories: ["vins-blancs", "vins-bio"],
    consommation: "plaisir-immediat",
    description: "LE Bourgogne du domaine de la CADETTE à VEZELAY par Valentin MONTADET. Blanc Vif et charmeur 100% Chardonnay. Jolie mise en jambe."
  },
  {
    id: "bourgogne-rouge-2025-domaine-la-soeur-cadette",
    ref: "264",
    nom: "BOURGOGNE Rouge 2025 Domaine La Soeur Cadette",
    prix: 21.90,
    image: "assets/bouteilles/bourgogne-rouge-2025-domaine-la-soeur-cadette.jpg",
    region: "beaujolais",
    categories: ["vins-rouges", "vins-bio"],
    consommation: "plaisir-immediat",
    description: "Bourgogne rouge donc 100% Pinot Noir pour cette cuvée du Domaine de la Soeur Cadette. C'est vif, gourmand, charmeur, très vinsdecopains. Un fruit net avec une bouche franche et gourmande. Tout ce qu'on aime \"du sérieux sans se prendre au sérieux\"."
  },
  {
    id: "bourgogne-chablis-saint-martin-2021-domaine-laroche",
    ref: "269",
    nom: "BOURGOGNE CHABLIS Saint Martin 2021 Domaine LAROCHE",
    prix: 21.60,
    image: "assets/bouteilles/bourgogne-chablis-saint-martin-2021-domaine-laroche.jpg",
    region: "bourgogne",
    categories: ["vins-blancs"],
    consommation: "plaisir-immediat",
    description: "La minéralité typique de Chablis ici magnifiée par le domaine Laroche ! Sélection parcellaire pour bien retranscrire les terroirs de Chablis."
  },
  {
    id: "bourgogne-st-aubin-la-princee-hubert-lamy-2020",
    ref: "365",
    nom: "BOURGOGNE ST Aubin La Princée HUBERT LAMY 2020",
    prix: 59.00,
    image: "assets/bouteilles/bourgogne-st-aubin-la-princee-hubert-lamy-2020.jpg",
    region: "bourgogne",
    categories: ["vins-blancs"],
    consommation: "a-mettre-en-cave",
    description: "Un Saint Aubin blanc de haute volée... une belle tension, une attente de quelques années recommandée."
  },
  {
    id: "ventoux-domaine-brunier-megaphone-2023",
    ref: "272",
    nom: "VENTOUX Domaine Brunier MEGAPHONE 2023",
    prix: 19.80,
    image: "assets/bouteilles/ventoux-domaine-brunier-megaphone-2023.jpg",
    region: "vallee-du-rhone",
    categories: ["vins-rouges"],
    consommation: "plaisir-immediat",
    description: "Une appellation VENTOUX qui mérite d'être mieux reconnue. C'est bien grâce à de grands noms comme la famille BRUNIER du célèbre VIEUX TELEGRAPHE que cela est possible et fort bien maitrisé. La bouteille qui fait du bien."
  },
  {
    id: "bourgogne-pierre-boisson-les-belles-cotes-2020",
    ref: "371",
    nom: "BOURGOGNE Pierre BOISSON Les Belles Côtes 2020",
    prix: 52.90,
    image: "assets/bouteilles/bourgogne-pierre-boisson-les-belles-cotes-2020.jpg",
    region: "bourgogne",
    categories: ["vins-blancs"],
    consommation: "",
    description: "On se régale toutes et tous de ce Bourgogne de chez Pierre BOISSON. Ici une Bourgogne issu d'une nouvelle parcelle (en 2020) dite \" des belles côtes\". Un grand bourgogne Blanc qui vous ravira d'ici quelques années."
  },
  {
    id: "bourgogne-chablis-les-grands-terroirs-samuel-billaud-2020",
    ref: "276",
    nom: "BOURGOGNE CHABLIS les grands terroirs Samuel BILLAUD 2020",
    prix: 27.80,
    image: "assets/bouteilles/bourgogne-chablis-les-grands-terroirs-samuel-billaud-2020.jpg",
    region: "bourgogne",
    categories: ["vins-blancs"],
    consommation: "plaisir-immediat",
    description: "Eclat du fruit, minéralité, tension. Les superlatifs ne manquent pas pour qualifié ce Chablis de Samuel BILLAUD."
  },
  {
    id: "bourgogne-rully-blanc-village-vincent-dureuil-janthial-2023",
    ref: "278",
    nom: "BOURGOGNE RULLY Blanc Village Vincent DUREUIL JANTHIAL 2023",
    prix: 42.90,
    image: "assets/bouteilles/bourgogne-rully-blanc-village-vincent-dureuil-janthial-2023.jpg",
    region: "bourgogne",
    categories: ["vins-blancs", "vins-bio"],
    consommation: "plaisir-immediat",
    description: "Cuvée simple d'appellation mais extrêmement bien réalisée. Joli gras, boisé subtil (un peu en vinification et un peu en élevage). Cuvée issue de vignes de 40 ans d'âge sur plusieurs parcelles. Mise en bouteille selon calendrier lunaire.. du très beau travail."
  },
  {
    id: "condrieu-clos-des-bouchers-maison-delas-2020",
    ref: "284",
    nom: "CONDRIEU \"Clos des bouchers \" Maison DELAS 2020",
    prix: 46.80,
    image: "assets/bouteilles/condrieu-clos-des-bouchers-maison-delas-2020.jpg",
    region: "vallee-du-rhone",
    categories: ["vins-blancs"],
    consommation: "plaisir-immediat",
    description: "CONDRIEU, c'est une appellation magique sans doute liée en partie à la toute petite taille son terroir. Ici le Clos des Bouchers vous enivrera par un cépage VIOGNIER tellement fruité. Une pépite pour les grands repas. Quand on voit les notes de dégustations, ca ferait pâlir un dictateur qui aurait outrajeusement \"bourré\" les urnes."
  },
  {
    id: "loire-sancerre-rouge-petite-moussiere-alphonse-mellot-2019",
    ref: "286",
    nom: "LOIRE SANCERRE Rouge \"Petite Moussière\" Alphonse MELLOT 2019",
    prix: 34.90,
    image: "assets/bouteilles/loire-sancerre-rouge-petite-moussiere-alphonse-mellot-2019.jpg",
    region: "loire",
    categories: ["vins-rouges", "vins-bio"],
    consommation: "plaisir-immediat",
    description: "Un pinot Noir en terre de Loire. C'est une jolie performance que cette cuvée de la petite Moussière."
  },
  {
    id: "loire-sancerre-la-moussiere-alphonse-mellot-2020",
    ref: "287",
    nom: "LOIRE SANCERRE \"La Moussière\" Alphonse MELLOT 2020",
    prix: 34.90,
    image: "assets/bouteilles/loire-sancerre-la-moussiere-alphonse-mellot-2020.jpg",
    region: "loire",
    categories: ["vins-blancs", "vins-bio"],
    consommation: "plaisir-immediat",
    description: "Sancerre / Sauvignon Blanc ! Pour les amateurs de vins blancs c'est la garantie de fraîcheur et de minéralité."
  },
  {
    id: "bordeaux-graves-chateau-pont-de-brion-2024",
    ref: "25",
    nom: "BORDEAUX GRAVES Château Pont de BRION 2024",
    prix: 14.90,
    image: "assets/bouteilles/bordeaux-graves-chateau-pont-de-brion-2024.jpg",
    region: "bordeaux",
    categories: ["vins-blancs"],
    consommation: "plaisir-immediat",
    selection: true,
    description: "Excellent Graves Blanc mis en musique par la famille MOLINARI. Belle fraîcheur, du fruit de la rondeur, disons un peu tout ce qu'on aime dans le blanc."
  },
  {
    id: "bourgogne-auxey-duresses-1er-cru-en-reugne-blanc-domaine-pierre-boisson-2020",
    ref: "55",
    nom: "BOURGOGNE AUXEY DURESSES 1er Cru En Reugne Blanc Domaine Pierre BOISSON 2020",
    prix: 89.00,
    image: "assets/bouteilles/bourgogne-auxey-duresses-1er-cru-en-reugne-blanc-domaine-pierre-boisson-2020.jpg",
    region: "bourgogne",
    categories: ["vins-blancs"],
    consommation: "a-mettre-en-cave",
    description: "Dans le domaine Boisson Vadot je demande le fils Pierre et ici une pépite l'Auxey Duresses Blanc 1er Cru en REUGNE."
  },
  {
    id: "cotes-du-rhone-blanc-les-2-albions-chateau-saint-cosme-2024",
    ref: "21",
    nom: "CÔTES DU RHONE BLANC les 2 Albions Château SAINT COSME 2024",
    prix: 15.90,
    image: "assets/bouteilles/cotes-du-rhone-blanc-les-2-albions-chateau-saint-cosme-2024.jpg",
    region: "vallee-du-rhone",
    categories: ["vins-blancs"],
    consommation: "plaisir-immediat",
    description: "Pour qui aime les côtes du Rhône blanc, voici le SAINT COSME dans sa couleur blanche. C'est une cuvée parcélaire les 2 albions (existe aussi en Rouge, c'est délicieux, le rapport qualité prix aussi je trouve)"
  },
  {
    id: "cote-roannaise-cuvee-diogene-domaine-des-pothiers-2020",
    ref: "290",
    nom: "COTE ROANNAISE Cuvée DIOGENE Domaine des Pothiers 2020",
    prix: 29.80,
    image: "assets/bouteilles/cote-roannaise-cuvee-diogene-domaine-des-pothiers-2020.jpg",
    region: "cote-roannaise",
    categories: ["vins-rouges", "vins-bio"],
    consommation: "plaisir-immediat",
    description: "Vins de grande classe, rondeur, finesse, fraîcheur. Une grande bouteille. Elevage de 6 mois en amphore."
  },
  {
    id: "igp-urge-blanc-cuvee-fou-de-chene-domaine-des-pothiers-2021",
    ref: "291",
    nom: "IGP Urgé Blanc Cuvée FOU DE CHENE Domaine des Pothiers 2021",
    prix: 17.80,
    image: "assets/bouteilles/igp-urge-blanc-cuvee-fou-de-chene-domaine-des-pothiers-2021.jpg",
    region: "cote-roannaise-urfe",
    categories: ["vins-blancs", "vins-bio"],
    consommation: "plaisir-immediat",
    description: "Un blanc charmeur sur une appellation rare. Un élevage en foudre (sans bois neuf) pour un boisé bien présent mais pas exagéré. Une belle bouteille à partager sur des fruits de mer et un peu de mayo :)"
  },
  {
    id: "loire-pouilly-fume-domaine-du-bouchot-caillottes-2022",
    ref: "292",
    nom: "LOIRE POUILLY FUME Domaine du BOUCHOT / CAILLOTTES 2022",
    prix: 36.90,
    image: "assets/bouteilles/loire-pouilly-fume-domaine-du-bouchot-caillottes-2022.jpg",
    region: "loire-pouilly-fume",
    categories: ["vins-blancs", "vins-bio"],
    consommation: "plaisir-immediat",
    description: "Un coup de coeur (et pas que de la RVF) pour cette cuvée des CAILLOTTES. Belle maturité et matière. Joli gras pas déplaisant pour un Sauvignon, intensité et saveurs sont au rdv."
  },
  {
    id: "pyrenees-orientales-un-faune-avec-son-fifre-herve-bizeul-du-clos-des-fees-2018",
    ref: "293",
    nom: "PYRENEES ORIENTALES Un faune avec son fifre Hervé BIZEUL du Clos des Fées 2018",
    prix: 38.80,
    image: "assets/bouteilles/pyrenees-orientales-un-faune-avec-son-fifre-herve-bizeul-du-clos-des-fees-2018.jpg",
    region: "languedoc",
    categories: ["vins-rouges"],
    consommation: "a-mettre-en-cave",
    description: "Un faune avec son fifre. Cuvée spéciale de Cabernet Franc et Merlot, grande densité, fruits rouges bien murs."
  },
  {
    id: "champagne-drappier-blanc-de-blancs-etui",
    ref: "295",
    nom: "Champagne DRAPPIER Blanc de Blancs (étui)",
    prix: 42.90,
    image: "assets/bouteilles/champagne-drappier-blanc-de-blancs-etui.jpg",
    region: "champagne",
    categories: ["fines-bulles"],
    consommation: "plaisir-immediat",
    description: "En Champagne un \"Blanc de Blancs\" est la quintessence du Champagne. Le cépage Chardonnay est le cépage de la fraicheur et de la vivacité. Une toute petite quantité de Pinot Noir (blanc vrai) est souvent ajouté. Quand en plus on est sur un dosage léger à 6g environ ca donne une belle cuvée bien expressive."
  },
  {
    id: "champagne-drappier-brut-nature-etui",
    ref: "296",
    nom: "Champagne DRAPPIER Brut NATURE (étui)",
    prix: 39.90,
    image: "assets/bouteilles/champagne-drappier-brut-nature-etui.jpg",
    region: "champagne",
    categories: ["fines-bulles"],
    consommation: "plaisir-immediat",
    description: "Cuvée BRUT Nature, 100% Pinot Noir de la côte de bar, zéro dosage. Elevage en cuve pour garder cette fraicheur."
  },
  {
    id: "bourgogne-pierre-boisson-les-belles-cotes-2021",
    ref: "437",
    nom: "BOURGOGNE Pierre BOISSON Les Belles Côtes 2021",
    prix: 52.90,
    image: "assets/bouteilles/bourgogne-pierre-boisson-les-belles-cotes-2021.jpg",
    region: "bourgogne",
    categories: ["vins-blancs"],
    consommation: "",
    description: "On se régale toutes et tous de ce Bourgogne de chez Pierre BOISSON. Ici une Bourgogne issu d'une nouvelle parcelle (en 2020) dite \" des belles côtes\". Un grand bourgogne Blanc qui vous ravira d'ici quelques années."
  },
  {
    id: "cotes-du-rhone-saint-joseph-poivre-et-sol-francois-villard-2021",
    ref: "71",
    nom: "COTES DU RHONE SAINT JOSEPH Poivre et Sol François VILLARD 2021",
    prix: 22.80,
    image: "assets/bouteilles/cotes-du-rhone-saint-joseph-poivre-et-sol-francois-villard-2021.jpg",
    region: "vallee-du-rhone",
    categories: ["vins-rouges"],
    consommation: "plaisir-immediat",
    selection: true,
    description: "Le Saint JOSEPH c'est bien une des pépites du domaine de François VILLARD. Ici c'est sa cuvée POIVRE et SOL qui porte si bien son nom. Puissance et parfums. J'adore !"
  },
  {
    id: "morgon-javernieres-aux-pierres-dom-louis-claude-desvignes-2021",
    ref: "303",
    nom: "MORGON Javernières AUX PIERRES Dom Louis Claude DESVIGNES 2021",
    prix: 29.90,
    image: "assets/bouteilles/morgon-javernieres-aux-pierres-dom-louis-claude-desvignes-2021.jpg",
    region: "beaujolais",
    categories: ["vins-rouges"],
    consommation: "plaisir-immediat",
    description: "Une cuvée MAGNIFIQUE que cette parcellaire Château GAILLARD de la fabuleuse côte du PY en vielles vignes par Louis Claude DESVIGNES. 3* RVF ici >95 par les grands de la dégustation. Vinification en Oeuf béton, pour des vins droits, soyeux et terriblement charmeurs."
  },
  {
    id: "graves-cuvee-divo-2018-par-le-chateau-pont-de-brion",
    ref: "145",
    nom: "GRAVES Cuvée DIVO 2018 par le Château Pont de BRION",
    prix: 33.50,
    image: "assets/bouteilles/graves-cuvee-divo-2018-par-le-chateau-pont-de-brion.jpg",
    region: "bordeaux",
    categories: ["vins-rouges"],
    consommation: "plaisir-immediat",
    selection: true,
    description: "La cuvée DIVO par le Pont de Brion, c'est une vinification intégrale (à savoir fermentation et élevage dans un foudre de 400 litres)"
  },
  {
    id: "cotes-du-rhone-chateau-saint-cosme-2024",
    ref: "12",
    nom: "CÔTES DU RHONE Château SAINT COSME 2024",
    prix: 11.60,
    image: "assets/bouteilles/cotes-du-rhone-chateau-saint-cosme-2024.jpg",
    region: "vallee-du-rhone",
    categories: ["vins-rouges"],
    consommation: "plaisir-immediat",
    description: "Un excellent rapport qualité prix cette Côtes du Rhône du Château SAINT COSME à Gigondas. Un vin de copains à ouvrir à la moindre occasion, c'est très bien fait, c'est plein de fruits rouges bien mûrs, parfumé. Existe aussi en Magnum sur demande et directement dans notre cave."
  },
  {
    id: "montlouis-sur-loire-cuvee-remus-jacky-blot-2021",
    ref: "90",
    nom: "MONTLOUIS SUR LOIRE Cuvee REMUS Jacky BLOT 2021",
    prix: 26.80,
    image: "assets/bouteilles/montlouis-sur-loire-cuvee-remus-jacky-blot-2021.jpg",
    region: "loire",
    categories: ["vins-blancs"],
    consommation: "plaisir-immediat",
    description: "Jacky ! tu nous régales avec ton chenin Blanc. Franchement il y a du niveau, c'est bon et rare sera la bouteille qui va restée entamée... Santé et merci Jacky !"
  },
  {
    id: "bourgogne-domaine-pierre-boisson-2023",
    ref: "467",
    nom: "BOURGOGNE Domaine Pierre BOISSON 2023",
    prix: 38.00,
    image: "assets/bouteilles/bourgogne-domaine-pierre-boisson-2023.jpg",
    region: "bourgogne",
    categories: ["vins-blancs"],
    consommation: "",
    description: "On se régale toutes et tous de ce Bourgogne de chez Pierre BOISSON. Un vin qui nous va bien. Une bouteille qui cache son jeu. Dommage que les quantités soient si faibles."
  },
  {
    id: "cote-rotie-porchette-julien-pilon-2021",
    ref: "306",
    nom: "COTE ROTIE Porchette Julien PILON 2021",
    prix: 49.60,
    image: "assets/bouteilles/cote-rotie-porchette-julien-pilon-2021.jpg",
    region: "vallee-du-rhone",
    categories: ["vins-rouges"],
    consommation: "a-mettre-en-cave",
    description: "Je ne sais pas vous, mais moi quand j'entends \"Côte Rotie\" mes papilles font la salsa. Quand j'entends Porsche c'est pareil... alors on sait déjà que l'on va se régaler. Et ici avec Julien PILON on est entre de bonnes mains. Puissance et finesse le bonheur est dans la côte... la raison : Elevage de 18 mois en barriques de 225 litres (dont 30% de bois neuf, ca claque !)"
  },
  {
    id: "gigondas-terrasses-du-diable-les-pallieres-2025",
    ref: "99",
    nom: "GIGONDAS Terrasses du Diable Les Pallières 2025",
    prix: 33.90,
    image: "assets/bouteilles/gigondas-terrasses-du-diable-les-pallieres-2025.jpg",
    region: "vallee-du-rhone",
    categories: ["vins-rouges"],
    consommation: "plaisir-immediat",
    description: "Domaine les PALLIERES à Gigondas, de la puissance pour cette Terrasse du Diable... tout un programme."
  },
  {
    id: "bourgogne-hautes-cotes-de-beaune-domaine-pierre-boisson-2021",
    ref: "202",
    nom: "BOURGOGNE HAUTES COTES DE BEAUNE Domaine Pierre BOISSON 2021",
    prix: 35.90,
    image: "assets/bouteilles/bourgogne-hautes-cotes-de-beaune-domaine-pierre-boisson-2021.jpg",
    region: "bourgogne",
    categories: ["vins-rouges"],
    consommation: "a-mettre-en-cave",
    description: "Domaine BOISSON aussi très agréable en rouge. Surtout sur le Hautes Côtes de Beaune."
  },
  {
    id: "bourgogne-monthelie-domaine-pierre-boisson-2023",
    ref: "316",
    nom: "BOURGOGNE MONTHELIE Domaine Pierre BOISSON 2023",
    prix: 39.90,
    image: "assets/bouteilles/bourgogne-monthelie-domaine-pierre-boisson-2023.jpg",
    region: "bourgogne",
    categories: ["vins-rouges"],
    consommation: "a-mettre-en-cave",
    description: "Une cuvée sympathique du domaine BOISSON qui se fera un plaisir de patienter un peu en cave quelques temps."
  },
  {
    id: "loire-clos-st-fiacre-blanc-parcellaire-les-larrys-2020",
    ref: "317",
    nom: "LOIRE Clos St Fiacre BLANC Parcellaire LES LARRYS 2020",
    prix: 34.90,
    image: "assets/bouteilles/loire-clos-st-fiacre-blanc-parcellaire-les-larrys-2020.jpg",
    region: "loire",
    categories: ["vins-blancs"],
    consommation: "a-mettre-en-cave",
    description: "Le Clos St Fiacre à 11km D'Orléans, des vins peu connus qui brillent par leur gourmandise et leur originalité. On croque dans ce vin, ici un parcellaire charmeur en 100% Chardonnay. Le premier millésime est le 2020 !"
  },
  {
    id: "chateauneuf-du-pape-dom-brunier-telegramme-2021",
    ref: "429",
    nom: "CHATEAUNEUF DU PAPE Dom Brunier Télégramme 2021",
    prix: 41.90,
    image: "assets/bouteilles/chateauneuf-du-pape-dom-brunier-telegramme-2021.jpg",
    region: "vallee-du-rhone",
    categories: ["vins-rouges"],
    consommation: "plaisir-immediat",
    description: "2nd vin du célèbre domaine du Vieux Télégraphe (vignobles Brunier) de Chateauneuf du Pape, il a beau être le second, il est 1er dans nos coeurs !"
  },
  {
    id: "bourgogne-blanc-domaine-leroy-2018",
    ref: "319",
    nom: "BOURGOGNE Blanc Domaine LEROY 2018",
    prix: 229.00,
    image: "assets/bouteilles/bourgogne-blanc-domaine-leroy-2018.jpg",
    region: "bourgogne",
    categories: ["vins-blancs"],
    consommation: "a-mettre-en-cave",
    description: "Le BLANC 100% Chardonnay du domaine LEROY est la bouteille \"entrée de gamme\" pour découvrir le travail de cette maison. Ca reste un mythe... Bouteille a apprécier jusqu'à la dernière goute."
  },
  {
    id: "bourgogne-meursault-grands-charrons-2018-domaine-michelot",
    ref: "324",
    nom: "BOURGOGNE MEURSAULT \"GRANDS CHARRONS\" 2018 Domaine MICHELOT",
    prix: 72.00,
    image: "assets/bouteilles/bourgogne-meursault-grands-charrons-2018-domaine-michelot.jpg",
    region: "bourgogne",
    categories: ["vins-blancs"],
    consommation: "a-mettre-en-cave",
    description: "MEURSAULT parcelle \"GRANDS CHARRONS\" par le domaine Michelot. Cette parcelle bien connue et partagée par d'autres domaines réputés. Vendanges traditionnelles et intervention des spécialistes de la vinification du chardonnay la Maison MICHELOT."
  },
  {
    id: "bourgogne-meursault-1er-cru-charmes-2020-domaine-michelot",
    ref: "325",
    nom: "BOURGOGNE MEURSAULT 1er Cru \"CHARMES\" 2020 Domaine MICHELOT",
    prix: 88.00,
    image: "assets/bouteilles/bourgogne-meursault-1er-cru-charmes-2020-domaine-michelot.jpg",
    region: "bourgogne",
    categories: ["vins-blancs"],
    consommation: "a-mettre-en-cave",
    description: "MEURSAULT 1er cru CHARMES \" par le domaine Michelot. Rien que la lecture de l'étiquette doit vous donner des frissons... Vendanges traditionnelles et intervention des spécialistes de la vinification du chardonnay la Maison MICHELOT."
  },
  {
    id: "alsace-domaine-weinbach-cuvee-pinots-grand-cru-furtsentum-2021",
    ref: "327",
    nom: "ALSACE DOMAINE WEINBACH Cuvée Pinots GRAND CRU FURTSENTUM 2021",
    prix: 59.80,
    image: "assets/bouteilles/alsace-domaine-weinbach-cuvee-pinots-grand-cru-furtsentum-2021.jpg",
    region: "alsace",
    categories: ["vins-blancs", "vins-bio"],
    consommation: "belle-garde",
    description: "Une cuvée parcellaire de pinots, elle est emblématique et rare. On est sur un élevage en fût, un grans cru, un moment suspendu."
  },
  {
    id: "alsace-gewurtztraminer-domaine-weinbach-cuvee-laurence-2020",
    ref: "329",
    nom: "ALSACE GEWURTZTRAMINER DOMAINE WEINBACH Cuvée LAURENCE 2020",
    prix: 33.80,
    image: "assets/bouteilles/alsace-gewurtztraminer-domaine-weinbach-cuvee-laurence-2020.jpg",
    region: "alsace",
    categories: ["vins-blancs", "vins-bio"],
    consommation: "plaisir-immediat",
    description: "Ah le GEWURTZ, reconnaissable entre mille. C'est ce qui fait la sigularité de ces vins. Vinifiés et élevés avec grand soin, cette cuvée LAURENCE (un prénom des membres de cette famille FALLER) est une bombe aromatique."
  },
  {
    id: "alsace-gewurtztraminer-domaine-weinbach-altenbourg-2020",
    ref: "330",
    nom: "ALSACE GEWURTZTRAMINER DOMAINE WEINBACH Altenbourg 2020",
    prix: 41.50,
    image: "assets/bouteilles/alsace-gewurtztraminer-domaine-weinbach-altenbourg-2020.jpg",
    region: "alsace",
    categories: ["vins-blancs", "vins-bio"],
    consommation: "plaisir-immediat",
    description: "Le célèbre GEWURZTRAMINER ALTENBOURG du nom de cette parcelle, juste en dessous de FURSTENTUM. C'est moelleux, terriblement charmeur."
  },
  {
    id: "cotes-de-gascogne-domaine-chiroulet-terra-nostra-2016",
    ref: "331",
    nom: "COTES DE GASCOGNE Domaine CHIROULET TERRA NOSTRA 2016",
    prix: 24.80,
    image: "assets/bouteilles/cotes-de-gascogne-domaine-chiroulet-terra-nostra-2016.jpg",
    region: "cotes-de-gascogne",
    categories: ["vins-rouges"],
    consommation: "plaisir-immediat",
    description: "Cuvée Spéciale du domaine CHIROULET elle n'est proposée que sur les grandes années. IL s'agit des vielles vignes implantées sur un terroir d'argile fine. On a du Tanat à 70% et 30% de merlot. Très bel assemblage aromatique, vin gourmand et puissant magnifique pour les amateurs de viande rouge..."
  },
  {
    id: "vin-de-france-domaine-de-marcoux-raisin-de-loup",
    ref: "477",
    nom: "VIN DE FRANCE Domaine de MARCOUX Raisin de LOUP",
    prix: 14.50,
    image: "assets/bouteilles/vin-de-france-domaine-de-marcoux-raisin-de-loup.jpg",
    region: "vallee-du-rhone",
    categories: ["vins-rouges", "vins-bio"],
    consommation: "plaisir-immediat",
    description: "Un vin de France pour un grand domaine, c'est comme le bistrot d'un chef étoilé... toujours un super rapport qualité indéniable. Le vin de copain par excellence."
  },
  {
    id: "lirac-domaine-de-marcoux-la-lorentine-2022",
    ref: "478",
    nom: "LIRAC Domaine de MARCOUX La Lorentine 2022",
    prix: 22.80,
    image: "assets/bouteilles/lirac-domaine-de-marcoux-la-lorentine-2022.jpg",
    region: "vallee-du-rhone",
    categories: ["vins-rouges", "vins-bio"],
    consommation: "plaisir-immediat",
    description: "Un LIRAC qui bénéficie forcément des mêmes attention que les Chateauneuf du domaine. Belle longueur et buvabilité. J'aime beaucoup."
  },
  {
    id: "cotes-du-roussillon-domaine-gauby-jasse-2021",
    ref: "338",
    nom: "CÔTES DU ROUSSILLON Domaine GAUBY / JASSE 2021",
    prix: 18.90,
    image: "assets/bouteilles/cotes-du-roussillon-domaine-gauby-jasse-2021.jpg",
    region: "languedoc",
    categories: ["vins-blancs", "vins-bio"],
    consommation: "plaisir-immediat",
    description: "Muscat petit grain, muscat. Elevage en barriques et foudres pour un joli vin fruité. Min en macération dit \"orange\""
  },
  {
    id: "loire-sancerre-domaine-denizot-cuvee-damocles-2021",
    ref: "339",
    nom: "LOIRE SANCERRE Domaine DENIZOT Cuvée DAMOCLES 2021",
    prix: 28.80,
    image: "assets/bouteilles/loire-sancerre-domaine-denizot-cuvee-damocles-2021.jpg",
    region: "loire",
    categories: ["vins-blancs"],
    consommation: "plaisir-immediat",
    description: "Cette cuvée 100% sauvignon est un petit diamant brut... Vin ciselé et cristallin grâce."
  },
  {
    id: "loire-sancerre-rouge-domaine-denizot-cuvee-biorga-2021",
    ref: "340",
    nom: "LOIRE SANCERRE Rouge Domaine DENIZOT Cuvée BIORGA 2021",
    prix: 28.80,
    image: "assets/bouteilles/loire-sancerre-rouge-domaine-denizot-cuvee-biorga-2021.jpg",
    region: "loire",
    categories: ["vins-rouges"],
    consommation: "plaisir-immediat",
    description: "Le Pinot Noir se plait bien dans la Loire. Fermentation cuve béton puis fûts 228 litres. Vin rouge de grande élégance grâce à une vinification peu interventionniste."
  },
  {
    id: "beaujolais-brouilly-domaine-les-garcons-2021",
    ref: "341",
    nom: "BEAUJOLAIS BROUILLY Domaine Les Garçons 2021",
    prix: 27.90,
    image: "assets/bouteilles/beaujolais-brouilly-domaine-les-garcons-2021.jpg",
    region: "beaujolais",
    categories: ["vins-rouges", "vins-bio"],
    consommation: "a-mettre-en-cave",
    description: "Joli cru du Beaujolais que ce Brouilly. 100% Gamay bien sûr, Cuvaison 15 jours en 3/4 de grappes entreières, quelques remontages. Vinif en levure indigène, à la fois cuve Inox puis Fûts de chêne pour 6 à 8 mois."
  },
  {
    id: "beaujolais-villages-domaine-les-garcons-2022",
    ref: "342",
    nom: "BEAUJOLAIS Villages Domaine Les Garçons 2022",
    prix: 15.90,
    image: "assets/bouteilles/beaujolais-villages-domaine-les-garcons-2022.jpg",
    region: "beaujolais",
    categories: ["vins-rouges", "vins-bio"],
    consommation: "plaisir-immediat",
    description: "Ce Beaujolais Villages n'est pas celui que vous croyez. On a une belle densité, un gamay bien enveloppant qui vous fera changer d'avis sur le gamay... si besoin...Vendanges manuelles, 6 jours de cuvaison, en macération carbonique grappe entière, Cuve inoxydable pour l'élevage sur 5 mois."
  },
  {
    id: "beaujolais-blanc-domaine-les-garcons-2022",
    ref: "343",
    nom: "BEAUJOLAIS BLANC Domaine Les Garçons 2022",
    prix: 24.90,
    image: "assets/bouteilles/beaujolais-blanc-domaine-les-garcons-2022.jpg",
    region: "beaujolais",
    categories: ["vins-blancs", "vins-bio"],
    consommation: "plaisir-immediat",
    description: "Cépage chardonnay, vendanges manuelles, vinai en levure indigène avec soutirage en fin de fermentation. Elevage en fût léger sur 2 mois."
  },
  {
    id: "corse-domaine-yves-leccia-cuvee-altru-biancu-2022",
    ref: "350",
    nom: "CORSE Domaine Yves LECCIA Cuvée ALTRU BIANCU 2022",
    prix: 24.90,
    image: "assets/bouteilles/corse-domaine-yves-leccia-cuvee-altru-biancu-2022.jpg",
    region: "corse",
    categories: ["vins-blancs", "vins-bio"],
    consommation: "plaisir-immediat",
    description: "Cuvée en IGP ile de Beauté, 100% Biancu Gentile. Un vin gracieux, de par son terroir composé de calcaire et de schistes. Elevage cuve Inox. Régalez vous."
  },
  {
    id: "corse-domaine-yves-leccia-cuvee-yl-blanc-2022",
    ref: "348",
    nom: "CORSE Domaine Yves LECCIA Cuvée YL BLANC 2022",
    prix: 23.50,
    image: "assets/bouteilles/corse-domaine-yves-leccia-cuvee-yl-blanc-2022.jpg",
    region: "corse",
    categories: ["vins-blancs", "vins-bio"],
    consommation: "plaisir-immediat",
    description: "La cuvée YL en BLANC a été mon premier coup de coeur pour les vins Corses. Joli assemblage de Vermentinu et Biancu Gentile, on a un vin fruité et délicieusement gourmand."
  },
  {
    id: "vdf-orgie-par-marius-bielle-chemins-de-l-arkose-2022",
    ref: "351",
    nom: "VDF ORGIE par Marius Bielle / Chemins de l'Arkose 2022",
    prix: 28.50,
    image: "assets/bouteilles/vdf-orgie-par-marius-bielle-chemins-de-l-arkose-2022.jpg",
    region: "vin-de-france",
    categories: ["vins-rouges", "vins-bio"],
    consommation: "plaisir-immediat",
    description: "Collab entre Marius BIELLE (qui apporte ses Merlot de Lalande) et Les Chemins de l'Arkose qui fournit son Gamay. Ca donne un assemblage sympathique, pas trop nature, qui se tient bien."
  },
  {
    id: "bordeaux-domaine-trebuchet-cuvee-porcelaine-2021",
    ref: "352",
    nom: "BORDEAUX Domaine TREBUCHET Cuvée porcelaine 2021",
    prix: 14.90,
    image: "assets/bouteilles/bordeaux-domaine-trebuchet-cuvee-porcelaine-2021.jpg",
    region: "bordeaux",
    categories: ["vins-rouges", "vins-bio"],
    consommation: "plaisir-immediat",
    description: "Une cuvée unique que cette PORCELAIRE. Amphore fabriqué dans cette matière qui va laisser le vins s'exprimer à 100% sans altération. Je vous laisse juge, moi j'ai beaucoup aimé."
  },
  {
    id: "loire-muscadet-cuvee-gula-ana-2020-goulaine-domaine-luneau-papin",
    ref: "355",
    nom: "LOIRE MUSCADET Cuvée GULA ANA 2020 Goulaine Domaine LUNEAU PAPIN",
    prix: 32.50,
    image: "assets/bouteilles/loire-muscadet-cuvee-gula-ana-2020-goulaine-domaine-luneau-papin.jpg",
    region: "loire",
    categories: ["vins-blancs", "vins-bio"],
    consommation: "",
    description: ""
  },
  {
    id: "loire-muscadet-cuvee-le-verger-2020-domaine-luneau-papin",
    ref: "357",
    nom: "LOIRE MUSCADET Cuvée LE VERGER 2020 Domaine LUNEAU PAPIN",
    prix: 13.90,
    image: "assets/bouteilles/loire-muscadet-cuvee-le-verger-2020-domaine-luneau-papin.jpg",
    region: "loire",
    categories: ["vins-blancs", "vins-bio"],
    consommation: "",
    description: ""
  },
  {
    id: "loire-muscadet-cuvee-vera-cruz-2022-domaine-luneau-papin",
    ref: "356",
    nom: "LOIRE MUSCADET Cuvée VERA CRUZ 2022 Domaine LUNEAU PAPIN",
    prix: 22.60,
    image: "assets/bouteilles/loire-muscadet-cuvee-vera-cruz-2022-domaine-luneau-papin.jpg",
    region: "loire",
    categories: ["vins-blancs", "vins-bio"],
    consommation: "",
    description: ""
  },
  {
    id: "champagne-dom-perignon-2013-en-coffret-luxe",
    ref: "358",
    nom: "CHAMPAGNE DOM PERIGNON 2013 en Coffret Luxe",
    prix: 249.00,
    image: "assets/bouteilles/champagne-dom-perignon-2013-en-coffret-luxe.jpg",
    region: "champagne",
    categories: ["fines-bulles"],
    consommation: "plaisir-immediat",
    description: "Avec la cuvée DOM PERIGNON en coffret 2013 de la maison Moët, on est dans l'excellence et en très bonne compagnie. C'est LA bouteille qui fait rêver, un peu de la race des seigneurs ..."
  },
  {
    id: "champagne-krug-grande-cuvee-edition-coffret",
    ref: "360",
    nom: "CHAMPAGNE KRUG GRANDE CUVEE Edition Coffret",
    prix: 249.00,
    image: "assets/bouteilles/champagne-krug-grande-cuvee-edition-coffret.jpg",
    region: "champagne",
    categories: ["fines-bulles"],
    consommation: "a-mettre-en-cave",
    description: "On se fait plaisir, avec une bouteille d'excellence. Assemblage en 2015 de 131 vins des millésimes 2000 à 2015. Puis élevage 7 années en cave avant sa commercialisation. De l'excellence je vous dis."
  },
  {
    id: "champagne-la-grande-dame-de-veuve-clicquot-2015-coffret",
    ref: "361",
    nom: "CHAMPAGNE LA GRANDE DAME de Veuve CLICQUOT 2015 (coffret)",
    prix: 198.00,
    image: "assets/bouteilles/champagne-la-grande-dame-de-veuve-clicquot-2015-coffret.jpg",
    region: "champagne",
    categories: ["fines-bulles"],
    consommation: "plaisir-immediat",
    description: "On aime les Champagnes de la maison Veuve Clicquot ou alors on adore. Et cette cuvée LA GRANDE DAME joue dans la cour des très grands !!! A l'origine 6 couleurs disponibles, contactez moi avant de commander pour savoir quels coloris sont encore disponibles."
  },
  {
    id: "cotes-de-provence-chateau-d-esclan-rock-angel-rose-2022",
    ref: "362",
    nom: "CÔTES DE PROVENCE Château D'ESCLAN ROCK ANGEL Rosé 2022",
    prix: 23.90,
    image: "assets/bouteilles/cotes-de-provence-chateau-d-esclan-rock-angel-rose-2022.jpg",
    region: "provence",
    categories: ["vins-roses"],
    consommation: "plaisir-immediat",
    description: "Un rosé qui comme d'autres domaines récemment repris, vise l'excellence dans la modernité. Il est dans le top 5, à vous de juger. Léger passage en fût pour 30% des raisins, ce qui pour lui donne son caractère racé. Pour reprendre les mots du domaine : Puissant, audacieux, intrépide :) tout est dit !"
  },
  {
    id: "cotes-de-provence-chateau-galoupet-cclasse-rose-2022",
    ref: "364",
    nom: "CÔTES DE PROVENCE Château GALOUPET CClassé Rosé 2022",
    prix: 48.90,
    image: "assets/bouteilles/cotes-de-provence-chateau-galoupet-cclasse-rose-2022.jpg",
    region: "provence",
    categories: ["vins-roses"],
    consommation: "plaisir-immediat",
    description: "Un rosé d'excellence, un cru classé de Provence qu'on va retrouver sur les plus grandes tables. Laissez vous tenter, logiquement on est super bien placé !"
  },
  {
    id: "bourgogne-chassagne-montrachet-la-goujonne-hubert-lamy-2020",
    ref: "366",
    nom: "BOURGOGNE Chassagne Montrachet La Goujonne Hubert LAMY 2020",
    prix: 68.00,
    image: "assets/bouteilles/bourgogne-chassagne-montrachet-la-goujonne-hubert-lamy-2020.jpg",
    region: "bourgogne",
    categories: ["vins-rouges"],
    consommation: "a-mettre-en-cave",
    description: "Chassage Montrachet en ROUGE. Ca peut surprendre dans l'appellation, et ca va vous surprendre dans le vert. Délcieuse bouteille."
  },
  {
    id: "loire-pouilly-fume-domaine-de-bouchot-mcmlv-2022",
    ref: "368",
    nom: "LOIRE POUILLY FUME Domaine de BOUCHOT / MCMLV 2022",
    prix: 32.90,
    image: "assets/bouteilles/loire-pouilly-fume-domaine-de-bouchot-mcmlv-2022.jpg",
    region: "loire-pouilly-fume",
    categories: ["vins-blancs", "vins-bio"],
    consommation: "plaisir-immediat",
    description: "Un coup de coeur (et pas que de la RVF) pour cette cuvée MCMLV assez exclusive. Vin de macération, couleur profonde et saveurs complexe. Terroir de kimméridgiennes. vieilles vigne de 60 ans... tout est dit :)"
  },
  {
    id: "bourgogne-les-clous-perrons-domaine-anne-boisson-2021",
    ref: "370",
    nom: "BOURGOGNE Les Clous Perrons Domaine Anne BOISSON 2021",
    prix: 43.90,
    image: "assets/bouteilles/bourgogne-les-clous-perrons-domaine-anne-boisson-2021.jpg",
    region: "bourgogne",
    categories: ["vins-blancs"],
    consommation: "plaisir-immediat",
    description: "Parcelle \"les clous perrons\" gérée par Anne BOISSON (donc la fille de Bernard, et la soeur de Pierre) qui travaille sur ses parcelles et signe son propre vin même si frère et soeur travaillent ensemble sur les vinifs (Elle nous propose aussi un superbe Meursault \"Sous la Velle\" dont le prix de cesse de s'envoler."
  },
  {
    id: "bourgogne-macon-pierre-boisson-au-poirier-chanin-2020",
    ref: "372",
    nom: "BOURGOGNE MACON Pierre BOISSON Au Poirier Chanin 2020",
    prix: 29.90,
    image: "assets/bouteilles/bourgogne-macon-pierre-boisson-au-poirier-chanin-2020.jpg",
    region: "bourgogne",
    categories: ["vins-blancs"],
    consommation: "",
    description: "On se régale toutes et tous de les Bourgognes de chez BOISSON. Ici son Macon de la parcelle \"Au poirier chanin\". Belle acidité et tenue. A attendre quelques années tout de même."
  },
  {
    id: "cotes-du-rhone-domaine-le-caillou-les-quartz-2021",
    ref: "373",
    nom: "CÔTES DU RHONE Domaine LE CAILLOU, Les QUARTZ 2021",
    prix: 22.90,
    image: "assets/bouteilles/cotes-du-rhone-domaine-le-caillou-les-quartz-2021.jpg",
    region: "vallee-du-rhone",
    categories: ["vins-rouges", "vins-bio"],
    consommation: "plaisir-immediat",
    description: "Une très jolie cuvée que ce QUARTZ composée à 85% de Grenache et 15% Syrah. Nez complexe et bien typé de la région, bouche soyeuse, à attendre quelques années idéalement."
  },
  {
    id: "bourgogne-meursault-les-perchots-pierre-boisson-2022",
    ref: "376",
    nom: "BOURGOGNE MEURSAULT Les Perchots Pierre BOISSON 2022",
    prix: 94.00,
    image: "assets/bouteilles/bourgogne-meursault-les-perchots-pierre-boisson-2022.jpg",
    region: "bourgogne",
    categories: ["vins-blancs"],
    consommation: "a-mettre-en-cave",
    description: "Dans la famille BOISSON je demande le fils...Il s'agit désormais du domaine BOISSON Frère et Soeur Anne et Pierre. Depuis toujours les vinfications et les élevages sont équivalents qu'il s'agisse du Père, du fils ou de la fille. Les volumes sont réduits, à notre plus grand regret."
  },
  {
    id: "chateauneuf-du-pape-chateau-st-cosme-2019",
    ref: "377",
    nom: "CHATEAUNEUF DU PAPE Château ST COSME 2019",
    prix: 39.90,
    image: "assets/bouteilles/chateauneuf-du-pape-chateau-st-cosme-2019.jpg",
    region: "vallee-du-rhone",
    categories: ["vins-rouges"],
    consommation: "plaisir-immediat",
    description: "Très beau Châteauneuf du Pape pour les amateurs de vins corsés et puissants."
  },
  {
    id: "rhone-cornas-vin-noir-2022-domaine-du-tunnel-stephane-robert",
    ref: "381",
    nom: "RHONE CORNAS Vin NOIR 2022 Domaine du Tunnel Stéphane ROBERT",
    prix: 75.00,
    image: "assets/bouteilles/rhone-cornas-vin-noir-2022-domaine-du-tunnel-stephane-robert.jpg",
    region: "vallee-du-rhone",
    categories: ["vins-rouges"],
    consommation: "plaisir-immediat",
    description: "Un CORNAS \"vin noir\" qui est d'une incroyable densité. La bouteille grand plaisir."
  },
  {
    id: "rhone-cornas-2022-domaine-du-tunnel-stephane-robert",
    ref: "380",
    nom: "RHONE CORNAS 2022 Domaine du Tunnel Stéphane ROBERT",
    prix: 49.50,
    image: "assets/bouteilles/rhone-cornas-2022-domaine-du-tunnel-stephane-robert.jpg",
    region: "vallee-du-rhone",
    categories: ["vins-rouges"],
    consommation: "plaisir-immediat",
    description: "Un 100% Syrah dense à souhait, pour les bons moments d'épicuriens."
  },
  {
    id: "rhone-st-peray-cuvee-prestige-2022-domaine-du-tunnel-stephane-robert",
    ref: "379",
    nom: "RHONE ST PERAY Cuvée prestige 2022 Domaine du Tunnel Stéphane ROBERT",
    prix: 38.90,
    image: "assets/bouteilles/rhone-st-peray-cuvee-prestige-2022-domaine-du-tunnel-stephane-robert.jpg",
    region: "vallee-du-rhone",
    categories: ["vins-blancs"],
    consommation: "plaisir-immediat",
    description: "Pour les amateurs de 100% Marsanne vous allez être aux anges."
  },
  {
    id: "rhone-cornas-pure-noir-2022-domaine-du-tunnel-stephane-robert",
    ref: "382",
    nom: "RHONE CORNAS PURE NOIR 2022 Domaine du Tunnel Stéphane ROBERT",
    prix: 149.00,
    image: "assets/bouteilles/rhone-cornas-pure-noir-2022-domaine-du-tunnel-stephane-robert.jpg",
    region: "vallee-du-rhone",
    categories: ["vins-rouges"],
    consommation: "plaisir-immediat",
    description: "Un diamant BRUT et une incroyable densité. Déjà un Cornas vin NOIR est d'une incroyable densité, mais là on est au sommet. Prix en conséquence. 1 bouteille par commande :)"
  },
  {
    id: "saint-peray-les-pins-bernard-gripa-2022",
    ref: "385",
    nom: "SAINT PERAY Les PINS Bernard Gripa 2022",
    prix: 23.80,
    image: "assets/bouteilles/saint-peray-les-pins-bernard-gripa-2022.jpg",
    region: "vallee-du-rhone",
    categories: ["vins-blancs"],
    consommation: "plaisir-immediat",
    description: "La cuvée LES PINS est un assemblage à 70 % Marsanne et 30% Roussane. Elevage en fût et foudre, suberbe minéralité, un boisé subtil."
  },
  {
    id: "bordeaux-st-foy-reserve-de-famille-chateau-martet-2020",
    ref: "398",
    nom: "BORDEAUX ST FOY Réserve de famille Chateau MARTET 2020",
    prix: 44.90,
    image: "assets/bouteilles/bordeaux-st-foy-reserve-de-famille-chateau-martet-2020.jpg",
    region: "bordeaux",
    categories: ["vins-rouges"],
    consommation: "plaisir-immediat",
    description: "Réserve de famille (tout un programme) est issue à 100% du cépage MERLOT. Vendanges manuelles et vinifications de haute couture. Franchement la cuvée qui fait l'unanimité."
  },
  {
    id: "bordeaux-st-foy-chateau-martet-les-hauts-de-martet-2021",
    ref: "400",
    nom: "BORDEAUX ST FOY Château MARTET Les Hauts de MARTET 2021",
    prix: 19.50,
    image: "assets/bouteilles/bordeaux-st-foy-chateau-martet-les-hauts-de-martet-2021.jpg",
    region: "bordeaux",
    categories: ["vins-rouges"],
    consommation: "plaisir-immediat",
    description: "Sympathique bouteille que ces Hauts de Martet. C'est un vin charmant, bien typé Bordeaux St Emilien. On est dans ce qui se fait de très bien à Bordeaux."
  },
  {
    id: "bourgogne-cote-d-or-2022-domaine-francois-mikulski",
    ref: "393",
    nom: "BOURGOGNE Côte d'OR 2022 Domaine François MIKULSKI",
    prix: 34.80,
    image: "assets/bouteilles/bourgogne-cote-d-or-2022-domaine-francois-mikulski.jpg",
    region: "bourgogne",
    categories: ["vins-blancs"],
    consommation: "plaisir-immediat",
    description: "Première cuvée du domaine, c'est Aligoté alie fraicheur des fleurs blanches et des notes citronnées très agréables."
  },
  {
    id: "bourgogne-pommard-2022-domaine-francois-mikulski",
    ref: "407",
    nom: "BOURGOGNE Pommard 2022 Domaine François MIKULSKI",
    prix: 72.00,
    image: "assets/bouteilles/bourgogne-pommard-2022-domaine-francois-mikulski.jpg",
    region: "bourgogne",
    categories: ["vins-rouges"],
    consommation: "",
    description: ""
  },
  {
    id: "morgon-cote-du-py-louis-claude-desvignes-2021",
    ref: "409",
    nom: "MORGON Côte du PY Louis Claude DESVIGNES 2021",
    prix: 28.60,
    image: "assets/bouteilles/morgon-cote-du-py-louis-claude-desvignes-2021.jpg",
    region: "beaujolais",
    categories: ["vins-rouges"],
    consommation: "plaisir-immediat",
    description: "En MORGON je demande le domaine Louis Claude DESVIGNES. Ici la fameuse Côte du PY si croquante. Un vigneron, que dis-je une famille, une histoire. Vous êtes entre de bonnes mains. 3* RVF et notes > 95 par les grands dégustateurs. Un must."
  },
  {
    id: "morgon-cote-du-py-javernieres-dom-louis-claude-desvignes-2022",
    ref: "410",
    nom: "MORGON Côte du PY Javernières Dom Louis Claude DESVIGNES 2022",
    prix: 26.80,
    image: "assets/bouteilles/morgon-cote-du-py-javernieres-dom-louis-claude-desvignes-2022.jpg",
    region: "beaujolais",
    categories: ["vins-rouges"],
    consommation: "plaisir-immediat",
    description: "En MORGON je demande le domaine Louis Claude DESVIGNES. ... c'est le TOP ! ICI son Morgon \"Javernières\" est une merveille d'expressions aromatiques. La même parcelle que les IMPENITENTS (elle issue des vielles vignes) toujours très très rare mais tellement magique."
  },
  {
    id: "morgon-javernieres-aux-pierres-dom-louis-claude-desvignes-2022",
    ref: "412",
    nom: "MORGON Javernières AUX PIERRES Dom Louis Claude DESVIGNES 2022",
    prix: 29.80,
    image: "assets/bouteilles/morgon-javernieres-aux-pierres-dom-louis-claude-desvignes-2022.jpg",
    region: "beaujolais",
    categories: ["vins-rouges"],
    consommation: "plaisir-immediat",
    description: "Une cuvée MAGNIFIQUE que cette parcellaire Château GAILLARD de la fabuleuse côte du PY en vielles vignes par Louis Claude DESVIGNES. 3* RVF ici >95 par les grands de la dégustation. Vinification en Oeuf béton, pour des vins droits, soyeux et terriblement charmeurs."
  },
  {
    id: "chateauneuf-du-pape-domaine-mayard-2023",
    ref: "414",
    nom: "CHATEAUNEUF DU PAPE Domaine MAYARD 2023",
    prix: 58.90,
    image: "assets/bouteilles/chateauneuf-du-pape-domaine-mayard-2023.jpg",
    region: "vallee-du-rhone",
    categories: ["vins-rouges", "vins-bio"],
    consommation: "a-mettre-en-cave",
    description: "Un faible pour les Chateauneuf du Pape ? Alors vous allez craquer pour cette bouteille au jus intense et fin."
  },
  {
    id: "bourgogne-chablis-1er-cru-les-butteaux-thomas-pico-2019",
    ref: "418",
    nom: "BOURGOGNE CHABLIS 1er cru Les BUTTEAUX Thomas PICO 2019",
    prix: 72.90,
    image: "assets/bouteilles/bourgogne-chablis-1er-cru-les-butteaux-thomas-pico-2019.jpg",
    region: "bourgogne",
    categories: ["vins-blancs", "vins-bio"],
    consommation: "plaisir-immediat",
    description: "Thomas PICO crée des vins de Chablis biens élevés au caractère bien Chablisiens. Ca c'est du 1er cru LES BUTTEAUX, la cuvée la plus recherchée... on a ce qu'on mérite."
  },
  {
    id: "cote-rotie-chateau-st-cosme-2020",
    ref: "420",
    nom: "CÔTE RÔTIE Château St Cosme 2020",
    prix: 56.50,
    image: "assets/bouteilles/cote-rotie-chateau-st-cosme-2020.jpg",
    region: "vallee-du-rhone",
    categories: ["vins-rouges"],
    consommation: "a-mettre-en-cave",
    description: "La Côte Rôtie est emblématique de Rhône Nord. Certes on est sur un budget conséquent (en encore y a plus cher sur le net...) mais quel plaisir après quelques années en cave de déguster une telle bouteille."
  },
  {
    id: "cote-rotie-chateau-st-cosme-2022",
    ref: "421",
    nom: "CÔTE RÔTIE Château St Cosme 2022",
    prix: 58.50,
    image: "assets/bouteilles/cote-rotie-chateau-st-cosme-2022.jpg",
    region: "vallee-du-rhone",
    categories: ["vins-rouges"],
    consommation: "a-mettre-en-cave",
    description: "La Côte Rôtie est emblématique de Rhône Nord. Certes on est sur un budget conséquent (en encore y a plus cher sur le net...) mais quel plaisir après quelques années en cave de déguster une telle bouteille."
  },
  {
    id: "morgon-cote-du-py-javernieres-dom-louis-claude-desvignes-2021",
    ref: "422",
    nom: "MORGON Côte du PY Javernières Dom Louis Claude DESVIGNES 2021",
    prix: 26.80,
    image: "assets/bouteilles/morgon-cote-du-py-javernieres-dom-louis-claude-desvignes-2021.jpg",
    region: "beaujolais",
    categories: ["vins-rouges"],
    consommation: "plaisir-immediat",
    description: "En MORGON je demande le domaine Louis Claude DESVIGNES. ... c'est le TOP ! ICI son Morgon \"Javernières\" est une merveille d'expressions aromatiques. La même parcelle que les IMPENITENTS (elle issue des vielles vignes) toujours très très rare mais tellement magique."
  },
  {
    id: "cotes-du-rhone-rouge-cuvee-jules-rochebonne-la-bastide-st-dominique-2024",
    ref: "423",
    nom: "COTES DU RHONE Rouge Cuvée Jules ROCHEBONNE La Bastide St Dominique 2024",
    prix: 16.80,
    image: "assets/bouteilles/cotes-du-rhone-rouge-cuvee-jules-rochebonne-la-bastide-st-dominique-2024.jpg",
    region: "vallee-du-rhone",
    categories: ["vins-rouges", "vins-bio"],
    consommation: "plaisir-immediat",
    description: "Dans cette bouteille, vous trouverez profondeurs et les belles caractéristiques d'un CDR rouge pour un magnifique rapport qualité prix."
  },
  {
    id: "chateauneuf-du-pape-rouge-bastide-st-dominique-2022",
    ref: "143",
    nom: "CHATEAUNEUF DU PAPE Rouge Bastide St Dominique 2022",
    prix: 29.90,
    image: "assets/bouteilles/chateauneuf-du-pape-rouge-bastide-st-dominique-2022.jpg",
    region: "vallee-du-rhone",
    categories: ["vins-rouges", "vins-bio"],
    consommation: "plaisir-immediat",
    description: "Un Châteauneuf du Pape dans toute sa splendeur. 80% Grenache, 10 % Syrah et Mourvèdre et Cinsault. Y a du fruit dans ces vins la, et une belle matière. J'aime beaucoup et bien oxygéné ça se boit déjà très bien."
  },
  {
    id: "chateauneuf-du-pape-blanc-bastide-st-dominique-2023",
    ref: "424",
    nom: "CHATEAUNEUF DU PAPE Blanc Bastide St Dominique 2023",
    prix: 29.90,
    image: "assets/bouteilles/chateauneuf-du-pape-blanc-bastide-st-dominique-2023.jpg",
    region: "vallee-du-rhone",
    categories: ["vins-blancs", "vins-bio"],
    consommation: "plaisir-immediat",
    description: "Un Châteauneuf du Pape Blanc dans toute sa splendeur. Y a du fruit, du gras, une belle longueur, une belle matière. Depuis 2014 que je suis le domaine, c'est d'une parfaite régularité."
  },
  {
    id: "chateauneuf-du-pape-cuvee-les-hespedires-bastide-st-dominique-2021",
    ref: "425",
    nom: "CHATEAUNEUF DU PAPE Cuvée LES HESPEDIRES Bastide St Dominique 2021",
    prix: 42.90,
    image: "assets/bouteilles/chateauneuf-du-pape-cuvee-les-hespedires-bastide-st-dominique-2021.jpg",
    region: "vallee-du-rhone",
    categories: ["vins-rouges", "vins-bio"],
    consommation: "plaisir-immediat",
    description: "Un Châteauneuf du Pape dans toute sa splendeur. Une cuvée parcellaire du nom des HESPERIDES : 80% Grenache, 10 % Syrah et Mourvèdre et Cinsault. Y a du fruit dans ces vins la, et une belle matière. J'aime beaucoup et bien oxygéné ça se boit déjà très bien."
  },
  {
    id: "chateauneuf-du-pape-cuvee-secrets-de-pignan-bastide-st-dominique-2020",
    ref: "426",
    nom: "CHATEAUNEUF DU PAPE Cuvée SECRETS DE PIGNAN Bastide St Dominique 2020",
    prix: 62.50,
    image: "assets/bouteilles/chateauneuf-du-pape-cuvee-secrets-de-pignan-bastide-st-dominique-2020.jpg",
    region: "vallee-du-rhone",
    categories: ["vins-rouges", "vins-bio"],
    consommation: "plaisir-immediat",
    description: "Un Châteauneuf du Pape dans toute sa splendeur. Une cuvée parcellaire du nom du SECRET DE PIGNAN : 100% Grenache. IL y a du fruit et de la puissance dans ces vins la, une très belle matière. J'aime beaucoup et bien oxygéné ça se boit déjà très bien."
  },
  {
    id: "rhone-lirac-blanc-domaine-mayard-2023",
    ref: "427",
    nom: "RHONE LIRAC Blanc Domaine MAYARD 2023",
    prix: 23.30,
    image: "assets/bouteilles/rhone-lirac-blanc-domaine-mayard-2023.jpg",
    region: "vallee-du-rhone",
    categories: ["vins-blancs", "vins-bio"],
    consommation: "a-mettre-en-cave",
    description: "Une nouvelle cuvée par les trios des frères Arthur et Hugo rejoints par le beau frère jean. Joli assemblage de Grenache, Viognier et Roussanne."
  },
  {
    id: "bandol-domaine-tempier-blanc-2023",
    ref: "428",
    nom: "BANDOL Domaine TEMPIER Blanc 2023",
    prix: 32.50,
    image: "assets/bouteilles/bandol-domaine-tempier-blanc-2023.jpg",
    region: "bandol",
    categories: ["vins-blancs"],
    consommation: "plaisir-immediat",
    description: "L'unique blanc du domaine, un assemblage généreux de Clairette et Ugni blanc. Une belle fraîcheur matrisée pour ce vin \"plein Sud\"."
  },
  {
    id: "saint-joseph-cuvee-parady-par-bernard-gripa-2021",
    ref: "430",
    nom: "SAINT JOSEPH Cuvée PARADY Par Bernard GRIPA 2021",
    prix: 43.90,
    image: "assets/bouteilles/saint-joseph-cuvee-parady-par-bernard-gripa-2021.jpg",
    region: "vallee-du-rhone",
    categories: ["vins-rouges"],
    consommation: "attendre-2-3-ans",
    description: "Une cuvée d'une grande puissance issue de la parcelle \"PARADIS\". Elle fait partie des grandes cuvées que seules la SYRAH peut en donner. MAGNIFIQUE !"
  },
  {
    id: "cote-rotie-gallet-blanc-francois-villard-2020",
    ref: "72",
    nom: "CÔTE ROTIE Gallet Blanc François VILLARD 2020",
    prix: 54.90,
    image: "assets/bouteilles/cote-rotie-gallet-blanc-francois-villard-2020.jpg",
    region: "vallee-du-rhone",
    categories: ["vins-rouges"],
    consommation: "plaisir-immediat",
    description: "Oh la TRES Belle bouteille, une PEPITE ! un mix parfait entre une appelation prestigieuse 'COTE ROTIE' et un vigneron de grand talent François VILLARD, c'est GALLET BLANC."
  },
  {
    id: "cote-rotie-gallet-blanc-francois-villard-2021",
    ref: "419",
    nom: "CÔTE ROTIE Gallet Blanc François VILLARD 2021",
    prix: 54.90,
    image: "assets/bouteilles/cote-rotie-gallet-blanc-francois-villard-2021.jpg",
    region: "vallee-du-rhone",
    categories: ["vins-rouges"],
    consommation: "plaisir-immediat",
    description: "Oh la TRES Belle bouteille, une PEPITE ! un mix parfait entre une appelation prestigieuse 'COTE ROTIE' et un vigneron de grand talent François VILLARD, c'est GALLET BLANC."
  },
  {
    id: "nord-pas-de-calais-cotolhain-chardonnay-2024",
    ref: "433",
    nom: "NORD Pas de Calais COTOLHAIN Chardonnay 2024",
    prix: 18.90,
    image: "assets/bouteilles/nord-pas-de-calais-cotolhain-chardonnay-2024.jpg",
    region: "pas-de-calais",
    categories: ["vins-blancs"],
    consommation: "plaisir-immediat",
    description: "C'est en 2010 que l'aventure commence avec la plantation de pieds de Chardonnay sur le grand terril d'Haillicourt. Une pente raide qui force la vigne à aller chercher loin sa nutrition... C'est la naissance du CHARBONNAY ! Puis en 2020 le même cépage est planté sur le coteau du parc d'Olhain. Sol calcaire pour une grande minéralité."
  },
  {
    id: "bourgogne-macon-pierre-boisson-au-poirier-chanin-2021",
    ref: "435",
    nom: "BOURGOGNE MACON Pierre BOISSON Au Poirier Chanin 2021",
    prix: 29.90,
    image: "assets/bouteilles/bourgogne-macon-pierre-boisson-au-poirier-chanin-2021.jpg",
    region: "bourgogne",
    categories: ["vins-blancs"],
    consommation: "",
    description: "On se régale toutes et tous de les Bourgognes de chez BOISSON. Ici son Macon de la parcelle \"Au poirier chanin\". Belle acidité et tenue. A attendre quelques années tout de même."
  },
  {
    id: "bourgogne-les-clous-perrons-domaine-anne-boisson-2022",
    ref: "436",
    nom: "BOURGOGNE Les Clous Perrons Domaine Anne BOISSON 2022",
    prix: 44.90,
    image: "assets/bouteilles/bourgogne-les-clous-perrons-domaine-anne-boisson-2022.jpg",
    region: "bourgogne",
    categories: ["vins-blancs"],
    consommation: "plaisir-immediat",
    description: "Parcelle \"les clous perrons\" gérée par Anne BOISSON (donc la fille de Bernard, et la soeur de Pierre) qui travaille sur ses parcelles et signe son propre vin même si frère et soeur travaillent ensemble sur les vinifs (Elle nous propose aussi un superbe Meursault \"Sous la Velle\" dont le prix de cesse de s'envoler."
  },
  {
    id: "bourgogne-meursault-sous-la-velle-domaine-anne-boisson-2022",
    ref: "438",
    nom: "BOURGOGNE MEURSAULT Sous la Velle Domaine Anne BOISSON 2022",
    prix: 94.00,
    image: "assets/bouteilles/bourgogne-meursault-sous-la-velle-domaine-anne-boisson-2022.jpg",
    region: "bourgogne",
    categories: ["vins-blancs"],
    consommation: "a-mettre-en-cave",
    description: "Dans la famille BOISSON je demande la fille... il s'agit désormais du domaine BOISSON Frère et Soeur Anne et Pierre. Depuis toujours les vinfications et les élevages sont équivalents qu'il s'agisse du Père, du fils ou de la fille. Les volumes sont réduits, à notre plus grand regret."
  },
  {
    id: "bourgogne-hautes-cotes-de-beaune-domaine-pierre-boisson-2022",
    ref: "440",
    nom: "BOURGOGNE HAUTES COTES DE BEAUNE Domaine Pierre BOISSON 2022",
    prix: 38.90,
    image: "assets/bouteilles/bourgogne-hautes-cotes-de-beaune-domaine-pierre-boisson-2022.jpg",
    region: "bourgogne",
    categories: ["vins-rouges"],
    consommation: "a-mettre-en-cave",
    description: "Domaine BOISSON aussi très agréable en rouge. Surtout sur le Hautes Côtes de Beaune."
  },
  {
    id: "bourgogne-meursault-les-chevalieres-domaine-anne-boisson-2020",
    ref: "441",
    nom: "BOURGOGNE MEURSAULT Les Chevalières Domaine Anne BOISSON 2020",
    prix: 169.00,
    image: "assets/bouteilles/bourgogne-meursault-les-chevalieres-domaine-anne-boisson-2020.jpg",
    region: "bourgogne",
    categories: ["vins-blancs"],
    consommation: "a-mettre-en-cave",
    description: "Bouteille à savourer, SI C'EST DISPO PROFITEZ EN !"
  },
  {
    id: "champagne-veuve-clicquot-carte-jaune-mini-frigo",
    ref: "443",
    nom: "CHAMPAGNE Veuve CLICQUOT Carte Jaune MINI FRIGO",
    prix: 68.90,
    image: "assets/bouteilles/champagne-veuve-clicquot-carte-jaune-mini-frigo.jpg",
    region: "champagne",
    categories: ["fines-bulles"],
    consommation: "plaisir-immediat",
    description: "Le fameux Carte Jaune de Veuve Clicquot dans son petit frigo. C'est adorable, et forcément la belle idée cadeau."
  },
  {
    id: "chandon-spritz",
    ref: "444",
    nom: "CHANDON Spritz",
    prix: 15.90,
    image: "assets/bouteilles/chandon-spritz.jpg",
    region: "",
    categories: ["fines-bulles"],
    consommation: "",
    description: "Un produit unique que ce SPRITZ par Chandon. Quelques glaçons et c'est prêt !"
  },
  {
    id: "vin-de-terril-du-nord-charbonnay-2025",
    ref: "445",
    nom: "VIN DE TERRIL Du Nord / CHARBONNAY 2025",
    prix: 69.90,
    image: "assets/bouteilles/vin-de-terril-du-nord-charbonnay-2025.jpg",
    region: "nord-pas-de-calais",
    categories: ["vins-blancs"],
    consommation: "a-mettre-en-cave",
    description: "Un vin du Ch'Nord ? dont les vignes poussent sur un terril ? Vous êtes sérieux ? Oui très sérieux bien que très original et très bon. compte tenu des faibles quantités et de la forte demande :2 bouteilles Max par client (quand j'ai un peu de stock, Si vous ne pouvez en placer que 1 dans votre panier c'est que je suis sur les dernière bouteilles)"
  },
  {
    id: "bourgogne-meursault-les-perchots-pierre-boisson-2023",
    ref: "446",
    nom: "BOURGOGNE MEURSAULT Les Perchots Pierre BOISSON 2023",
    prix: 98.00,
    image: "assets/bouteilles/bourgogne-meursault-les-perchots-pierre-boisson-2023.jpg",
    region: "bourgogne",
    categories: ["vins-blancs"],
    consommation: "a-mettre-en-cave",
    description: "Dans la famille BOISSON je demande le fils...Il s'agit désormais du domaine BOISSON Frère et Soeur Anne et Pierre. Depuis toujours les vinfications et les élevages sont équivalents qu'il s'agisse du Père, du fils ou de la fille. Les volumes sont réduits, à notre plus grand regret."
  },
  {
    id: "rhone-crozes-hermitage-maison-delas-domaine-des-grands-chemins-2021",
    ref: "447",
    nom: "RHONE CROZES HERMITAGE Maison DELAS \"Domaine des Grands Chemins\" 2021",
    prix: 24.90,
    image: "assets/bouteilles/rhone-crozes-hermitage-maison-delas-domaine-des-grands-chemins-2021.jpg",
    region: "vallee-du-rhone",
    categories: ["vins-rouges"],
    consommation: "plaisir-immediat",
    description: "La belle bouteille que voila ! 100% SYRAH, 100% Rhone pour les amateurs."
  },
  {
    id: "bourgogne-rully-blanc-maizieres-vincent-dureuil-janthial-2023",
    ref: "449",
    nom: "BOURGOGNE RULLY Blanc MAIZIERES Vincent DUREUIL JANTHIAL 2023",
    prix: 48.90,
    image: "assets/bouteilles/bourgogne-rully-blanc-maizieres-vincent-dureuil-janthial-2023.jpg",
    region: "bourgogne",
    categories: ["vins-blancs", "vins-bio"],
    consommation: "plaisir-immediat",
    description: "Voila la cuvée MAIZIERES en Rully Blanc avec du bois neuf pour 1/4. Magnifique bouteille. Mise en bouteille selon calendrier lunaire.. du très beau travail."
  },
  {
    id: "bourgogne-rully-rouge-1er-cru-chapitre-vincent-dureuil-janthial-2023",
    ref: "450",
    nom: "BOURGOGNE Rully ROUGE 1er Cru CHAPITRE Vincent DUREUIL JANTHIAL 2023",
    prix: 54.90,
    image: "assets/bouteilles/bourgogne-rully-rouge-1er-cru-chapitre-vincent-dureuil-janthial-2023.jpg",
    region: "bourgogne",
    categories: ["vins-rouges", "vins-bio"],
    consommation: "a-mettre-en-cave",
    description: "Rully 1er cru Rouge CHAPITRE très agréable forcément en 100% pinot noir. Elevage de 12 mois en fût (30% de bois neuf). Une bouche longue et racée, du très grand."
  },
  {
    id: "bourgogne-blanc-vincent-dureuil-janthial-2023",
    ref: "451",
    nom: "BOURGOGNE Blanc Vincent DUREUIL JANTHIAL 2023",
    prix: 32.80,
    image: "assets/bouteilles/bourgogne-blanc-vincent-dureuil-janthial-2023.jpg",
    region: "bourgogne",
    categories: ["vins-blancs", "vins-bio"],
    consommation: "plaisir-immediat",
    description: "Cuvée d'entrée de gamme du domaine. Joli gras, belle fraicheur (bois : un peu en vinification et un peu en élevage). Mise en bouteille selon calendrier lunaire.. du très beau travail."
  },
  {
    id: "vdf-marverlan-cuvee-margueritte-gamay-2020",
    ref: "452",
    nom: "VDF MARVERLAN Cuvée MARGUERITTE Gamay 2020",
    prix: 16.90,
    image: "assets/bouteilles/vdf-marverlan-cuvee-margueritte-gamay-2020.jpg",
    region: "charente",
    categories: ["vins-rouges"],
    consommation: "plaisir-immediat",
    description: "Jolie cuvée de Gamay très gourmande. Rarement goûté un gamay aussi dense et suave."
  },
  {
    id: "vdf-marverlan-cuvee-gamay-de-bouze-2022",
    ref: "453",
    nom: "VDF MARVERLAN Cuvée GAMAY De BOUZE 2022",
    prix: 17.20,
    image: "assets/bouteilles/vdf-marverlan-cuvee-gamay-de-bouze-2022.jpg",
    region: "charente",
    categories: ["vins-rouges", "vins-bio"],
    consommation: "plaisir-immediat",
    description: "Jolie cuvée de Gamay très gourmande. Une sacré ampleur, un boisé agréable. Cuvée de BOUZE BIO, 30 mois d'élevage. Ni filtré ni collé."
  },
  {
    id: "champagne-philbert-fils-1er-cru-cuvee-invitation",
    ref: "456",
    nom: "CHAMPAGNE PHILBERT & FILS 1er cru Cuvée INVITATION",
    prix: 24.90,
    image: "assets/bouteilles/champagne-philbert-fils-1er-cru-cuvee-invitation.jpg",
    region: "champagne",
    categories: ["fines-bulles"],
    consommation: "plaisir-immediat",
    description: "Petite Maison de la côte des blancs sur Lilly La Montagne ... Un bien quel équilibre entre les 3 cépages comme on aime avec : 1/3 pour chacun : Chardonnay, Pinot Noir et Meunier. La régularité et l'équilibre à l'état pur. Du 1er CRU !"
  },
  {
    id: "cidre-fermier-normand-bio-la-charterie",
    ref: "458",
    nom: "CIDRE fermier Normand BIO La Charterie",
    prix: 5.90,
    image: "assets/bouteilles/cidre-fermier-normand-bio-la-charterie.jpg",
    region: "normandie",
    categories: ["fines-bulles"],
    consommation: "plaisir-immediat",
    description: "Quand depuis ton enfance tu vas en Normandie sur les terres de tes ancêtres... et qu'il y a cette ferme qui propose des cidres et poirés de grande qualité BIO à prix sympathique tu ne peux que les proposer sur ton site."
  },
  {
    id: "poire-fermier-normand-bio-la-charterie",
    ref: "459",
    nom: "Poiré fermier Normand BIO La Charterie",
    prix: 6.50,
    image: "assets/bouteilles/poire-fermier-normand-bio-la-charterie.jpg",
    region: "normandie",
    categories: ["fines-bulles"],
    consommation: "plaisir-immediat",
    description: "Quand depuis ton enfance tu vas en Normandie sur les terres de tes ancêtres... et qu'il y a cette ferme qui propose des cidres et poirés de grande qualité BIO à prix sympathique tu ne peux que les proposer sur ton site."
  },
  {
    id: "bourgogne-macon-peronne-les-cousits-domaine-pierre-boisson-2022",
    ref: "461",
    nom: "BOURGOGNE MACON Péronne \"Les Cousits\" Domaine Pierre BOISSON 2022",
    prix: 28.90,
    image: "assets/bouteilles/bourgogne-macon-peronne-les-cousits-domaine-pierre-boisson-2022.jpg",
    region: "bourgogne",
    categories: ["vins-blancs"],
    consommation: "",
    description: "On se régale toutes et tous de les Bourgognes de chez BOISSON. Ici le Macon Péronne parcelle \"Les Cousîtes\" belle tension"
  },
  {
    id: "bourgogne-rully-rouge-village-vincent-dureuil-janthial-2023",
    ref: "462",
    nom: "BOURGOGNE RULLY ROUGE Village Vincent DUREUIL JANTHIAL 2023",
    prix: 38.90,
    image: "assets/bouteilles/bourgogne-rully-rouge-village-vincent-dureuil-janthial-2023.jpg",
    region: "bourgogne",
    categories: ["vins-rouges", "vins-bio"],
    consommation: "a-mettre-en-cave",
    description: "Rully Rouge très agréable forcément en 100% pinot noir issu de 3 parcelles. Elevage de 12 mois en fût (30% de bois neuf). Une bouche longue et racée, du très grand."
  },
  {
    id: "rhone-crozes-hermitage-maison-delas-domaine-des-grands-chemins-2022",
    ref: "464",
    nom: "RHONE CROZES HERMITAGE Maison DELAS \"Domaine des Grands Chemins\" 2022",
    prix: 24.90,
    image: "assets/bouteilles/rhone-crozes-hermitage-maison-delas-domaine-des-grands-chemins-2022.jpg",
    region: "vallee-du-rhone",
    categories: ["vins-rouges"],
    consommation: "plaisir-immediat",
    description: "La belle bouteille que voila ! 100% SYRAH, 100% Rhone pour les amateurs."
  },
  {
    id: "bourgogne-audrey-duresses-1er-cru-rouge-pierre-boisson-2020",
    ref: "469",
    nom: "BOURGOGNE Audrey Duresses 1er Cru ROUGE Pierre BOISSON 2020",
    prix: 68.00,
    image: "assets/bouteilles/bourgogne-audrey-duresses-1er-cru-rouge-pierre-boisson-2020.jpg",
    region: "bourgogne",
    categories: ["vins-rouges"],
    consommation: "a-mettre-en-cave",
    description: "Un 1er cru ROUGE du domaine BOISSON ici Pierre sur l'appellation AUXEY DURESSES. Dernières bouteilles."
  },
  {
    id: "bourgogne-audrey-duresses-1er-cru-rouge-pierre-boisson-2021",
    ref: "470",
    nom: "BOURGOGNE Audrey Duresses 1er Cru ROUGE Pierre BOISSON 2021",
    prix: 68.00,
    image: "assets/bouteilles/bourgogne-audrey-duresses-1er-cru-rouge-pierre-boisson-2021.jpg",
    region: "bourgogne",
    categories: ["vins-rouges"],
    consommation: "a-mettre-en-cave",
    description: "Un 1er cru ROUGE du domaine BOISSON ici Pierre sur l'appellation AUXEY DURESSES. Dernières bouteilles."
  },
  {
    id: "loire-aoc-chinon-domaine-des-bernard-la-cote-2024",
    ref: "471",
    nom: "LOIRE Aoc CHINON Domaine des Bernard. LA COTE 2024",
    prix: 27.90,
    image: "assets/bouteilles/loire-aoc-chinon-domaine-des-bernard-la-cote-2024.jpg",
    region: "loire",
    categories: ["vins-blancs", "vins-bio"],
    consommation: "plaisir-immediat",
    description: "Après avoir été vendangés à la main en petites caissettes, les raisins sont triés en cave et pressés lentement en pressoir pneumatique. Après un léger débourbage aucun intrant n'est ajouté, et les fermentations alcoolique et malolactique se déroulent en barrique de 400l (20% de fût neuf et le reste en fût de 2 et 3 vins). Cette cuvée est ensuite mise en bouteille après 16 mois sur lies fines."
  },
  {
    id: "loire-aoc-chinon-domaine-des-bernard-les-trois-piliers-2022",
    ref: "472",
    nom: "LOIRE Aoc CHINON Domaine des Bernard. LES TROIS PILIERS 2022",
    prix: 16.90,
    image: "assets/bouteilles/loire-aoc-chinon-domaine-des-bernard-les-trois-piliers-2022.jpg",
    region: "loire",
    categories: ["vins-rouges", "vins-bio"],
    consommation: "plaisir-immediat",
    description: "Domaine des Bernard en AOC Chinon."
  },
  {
    id: "loire-aoc-chinon-domaine-des-bernard-pallus-2022",
    ref: "473",
    nom: "LOIRE Aoc CHINON Domaine des Bernard. PALLUS 2022",
    prix: 26.90,
    image: "assets/bouteilles/loire-aoc-chinon-domaine-des-bernard-pallus-2022.jpg",
    region: "loire",
    categories: ["vins-rouges", "vins-bio"],
    consommation: "a-mettre-en-cave",
    description: "Vendangés manuelle en petites caissettes, les raisins sont triés en cave, égrappés et mis en cuve béton pour la fermentation. Aucun ajout d'intrant pour laisser se dérouler les fermentations alcoolique et malolactique. Après le décuvage, le marc est pressé délicatement par un pressoir pneumatique avant de rejoindre le chai. La cuvée des Les Trois Piliers est ensuite élevée en cuve béton."
  },
  {
    id: "loire-aoc-chinon-domaine-des-bernard-ballet-2022",
    ref: "474",
    nom: "LOIRE Aoc CHINON Domaine des Bernard. BALLET 2022",
    prix: 51.90,
    image: "assets/bouteilles/loire-aoc-chinon-domaine-des-bernard-ballet-2022.jpg",
    region: "loire",
    categories: ["vins-rouges", "vins-bio"],
    consommation: "a-mettre-en-cave",
    description: "Vendangés à la main, tri en cave. 100% égrappés et mis en cuve béton de 50hl pour la fermentation et une macération d’un mois. Après le décuvage, fermentation malolactique en barrique de 400l (35% de fûts neufs et 35% de futs d’un vin. Elevage barrique 16 mois sur lies fines, sans filtration."
  },
  {
    id: "chateauneuf-du-pape-domaine-de-marcoux-2023",
    ref: "475",
    nom: "CHATEAUNEUF DU PAPE Domaine de MARCOUX 2023",
    prix: 54.90,
    image: "assets/bouteilles/chateauneuf-du-pape-domaine-de-marcoux-2023.jpg",
    region: "vallee-du-rhone",
    categories: ["vins-rouges", "vins-bio"],
    consommation: "",
    description: "Le Dieu des VINS. Un rouge discret caractéristique de cette appellation, quatre cépages en harmonie, de la puissance, BIENVENUE à CHÂTEAUNEUF DU PAPE."
  },
  {
    id: "chateauneuf-du-pape-domaine-de-marcoux-2024",
    ref: "476",
    nom: "CHATEAUNEUF DU PAPE Domaine de MARCOUX 2024",
    prix: 52.90,
    image: "assets/bouteilles/chateauneuf-du-pape-domaine-de-marcoux-2024.jpg",
    region: "vallee-du-rhone",
    categories: ["vins-blancs", "vins-bio"],
    consommation: "plaisir-immediat",
    description: "Le CHÂTEAUNEUF DU PAPE en blanc est toujours un grand moment. Des volumes assez faibles en général pour un plaisir intense !"
  },
  {
    id: "cotes-du-rhone-domaine-mayard-2025",
    ref: "479",
    nom: "COTES DU RHONE Domaine MAYARD 2025",
    prix: 18.90,
    image: "assets/bouteilles/cotes-du-rhone-domaine-mayard-2025.jpg",
    region: "vallee-du-rhone",
    categories: ["vins-rouges", "vins-bio"],
    consommation: "plaisir-immediat",
    description: "Un faible pour côtes du Rhône ? Une jolie bouteille qu'on adorera déguster avec ses copains... quantités trop faibles pour ne pas les partager :) 3 flacons par client."
  },
  {
    id: "bourgogne-rully-rouge-1er-cru-fosse-vincent-dureuil-janthial-2023",
    ref: "480",
    nom: "BOURGOGNE Rully ROUGE 1er Cru FOSSE Vincent DUREUIL JANTHIAL 2023",
    prix: 54.90,
    image: "assets/bouteilles/bourgogne-rully-rouge-1er-cru-fosse-vincent-dureuil-janthial-2023.jpg",
    region: "bourgogne",
    categories: ["vins-rouges", "vins-bio"],
    consommation: "a-mettre-en-cave",
    description: "Rully 1er cru Rouge FOSSE la grande finesse pour ce 100% pinot noir. Elevage de 12 mois en fût (30% de bois neuf). Une bouche longue et racée, du très grand."
  },
  {
    id: "bourgogne-mercurey-rouge-vincent-dureuil-janthial-2023",
    ref: "481",
    nom: "BOURGOGNE MERCUREY ROUGE Vincent DUREUIL JANTHIAL 2023",
    prix: 39.90,
    image: "assets/bouteilles/bourgogne-mercurey-rouge-vincent-dureuil-janthial-2023.jpg",
    region: "bourgogne",
    categories: ["vins-rouges", "vins-bio"],
    consommation: "a-mettre-en-cave",
    description: "Appellation MERCUREY pour le vigneron Dureul Janthial. Un Pinot noir ciselé, une belle gourmandise pour un plaisir optimal dans quelques années."
  },
  {
    id: "nord-pas-de-calais-cotolhain-pinot-gris-2024",
    ref: "482",
    nom: "NORD Pas de Calais COTOLHAIN Pinot Gris 2024",
    prix: 18.90,
    image: "assets/bouteilles/nord-pas-de-calais-cotolhain-pinot-gris-2024.jpg",
    region: "pas-de-calais",
    categories: ["vins-blancs"],
    consommation: "plaisir-immediat",
    description: "En 2010 l'aventure commence avec la plantation de pieds de Chardonnay sur le grand terril d'Haillicourt. Une pente raide qui force la vigne à aller chercher loin sa nutrition... C'est la naissance du CHARBONNAY ! Puis en 2020 le même cépage est planté sur le coteau du parc d'Olhain. Sol calcaire pour une grande minéralité. Une cuvée en Chardonnay puis vient toujours en mono cépage le PINOT GRIS"
  },
  {
    id: "cotes-de-provence-chateau-d-esclan-rock-angel-rose-2023",
    ref: "483",
    nom: "CÔTES DE PROVENCE Château D'ESCLAN ROCK ANGEL Rosé 2023",
    prix: 23.90,
    image: "assets/bouteilles/cotes-de-provence-chateau-d-esclan-rock-angel-rose-2023.jpg",
    region: "provence",
    categories: ["vins-roses"],
    consommation: "plaisir-immediat",
    description: "Un rosé qui comme d'autres domaines récemment repris, vise l'excellence dans la modernité. Il est dans le top 5, à vous de juger. Léger passage en fût pour 30% des raisins, ce qui pour lui donne son caractère racé. Pour reprendre les mots du domaine : Puissant, audacieux, intrépide :) tout est dit !"
  },
  {
    id: "vin-du-nord-domaine-terre-de-gres-cuvee-pierre-vagabonde",
    ref: "484",
    nom: "Vin du NORD Domaine TERRE DE GRES Cuvée Pierre VAGABONDE",
    prix: 17.90,
    image: "assets/bouteilles/vin-du-nord-domaine-terre-de-gres-cuvee-pierre-vagabonde.jpg",
    region: "nord-pas-de-calais",
    categories: ["vins-blancs"],
    consommation: "plaisir-immediat",
    nouveau: true,
    description: "Cuvée issue des Pinots Gris des Hauts de France. Elégance, fraicheur et fruit. Elevage à 60% en fûts de Chêne."
  },
  {
    id: "vin-du-nord-domaine-terre-de-gres-cuvee-table-des-fees",
    ref: "485",
    nom: "Vin du NORD Domaine TERRE DE GRES Cuvée TABLE DES FEES",
    prix: 22.90,
    image: "assets/bouteilles/vin-du-nord-domaine-terre-de-gres-cuvee-table-des-fees.jpg",
    region: "nord-pas-de-calais",
    categories: ["vins-blancs"],
    consommation: "plaisir-immediat",
    nouveau: true,
    description: "Cuvée issue du Chardonnay des Hauts de France. Elégance, fraicheur et fruit. Vinification et élevage en fûts de chêne."
  },
  {
    id: "bourgogne-melon-2025-blanc-domaine-la-soeur-cadette",
    ref: "486",
    nom: "BOURGOGNE Melon 2025 blanc Domaine La Soeur Cadette",
    prix: 19.50,
    image: "assets/bouteilles/bourgogne-melon-2025-blanc-domaine-la-soeur-cadette.jpg",
    region: "bourgogne",
    categories: ["vins-blancs", "vins-bio"],
    consommation: "plaisir-immediat",
    nouveau: true,
    description: "Le cépage emblématique le MELON de Bourgogne par le domaine de la CADETTE à VEZELAY par Valentin MONTADET. Blanc Vif et charmeur 100% Chardonnay. Le MELON ce cépage qu'on retrouve dans le Muscadet."
  }
];

/* --------------------------------------------------------------------------
   ACCESSOIRES — présents sur l'ancien site mais pas des vins :
   conservés ici pour mémoire, non affichés dans la cave.
   -------------------------------------------------------------------------- */
VDC.ACCESSOIRES = [
  { ref: "387", nom: "Verres SYDONIOS UBA / L'ESTHETE 465 ml Coffret 6 pièces.", prix: 189.00, image: "assets/bouteilles/verres-sydonios-uba-l-esthete-465-ml-coffret-6-pieces.jpg", description: "La finesse des verres SYDONIOS est vraiment gage d'une grande élégance. On est séduit par cette légèreté puis par la finesse du verre lors de la dégustation. Pour vous proposer un tel prix (31,5€ttc) j'ai sélectionné la gamme UBA (Unperfected But Amazing) qui a de très légers défauts qui parfois ne sont perceptibles qu'après une analyse approfondie du verre..." },
  { ref: "388", nom: "Verres SYDONIOS UBA / EMPREINTE 420 ml Coffret 6 pièces.", prix: 189.00, image: "assets/bouteilles/verres-sydonios-uba-empreinte-420-ml-coffret-6-pieces.jpg", description: "La finesse des verres SYDONIOS est vraiment gage d'une grande élégance. On est séduit par cette légèreté puis par la finesse du verre lors de la dégustation. Pour vous proposer un tel prix (31,5€ttc) j'ai sélectionné la gamme UBA (Unperfected But Amazing) qui a de très légers défauts qui parfois ne sont perceptibles qu'après une analyse approfondie du verre..." },
  { ref: "389", nom: "Verres SYDONIOS UBA / LE MERIDIONNAL 830 ml Coffret 6 pièces.", prix: 189.00, image: "assets/bouteilles/verres-sydonios-uba-le-meridionnal-830-ml-coffret-6-pieces.jpg", description: "La finesse des verres SYDONIOS est vraiment gage d'une grande élégance. On est séduit par cette légèreté puis par la finesse du verre lors de la dégustation. Pour vous proposer un tel prix (31,5€ttc) j'ai sélectionné la gamme UBA (Unperfected But Amazing) qui a de très légers défauts qui parfois ne sont perceptibles qu'après une analyse approfondie du verre..." },
  { ref: "392", nom: "CARTE DES VINS A GRATTER", prix: 29.90, image: "assets/bouteilles/carte-des-vins-a-gratter.jpg", description: "L'idée cadeau sympathique, ludique, culturelle ! Carte livrée dans son tube avec stylo \"gratteur\". Il vous suffit de la placer dans un cadre sans verre, et de gratter au fur et à mesure de vos dégustations." }
];
