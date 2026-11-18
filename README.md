# Vin des Copains — nouveau site

Site vitrine et boutique de la cave **Vin des Copains** (Vieux-Lille), refait à partir du site actuel
[www.vinsdecopains.com](https://www.vinsdecopains.com/).

Site 100 % statique (HTML / CSS / JavaScript, sans installation) : il suffit d'ouvrir `index.html`
ou de déposer le dossier chez n'importe quel hébergeur.

**Étape actuelle : châssis du site, sans aucune image.** Le design repose uniquement sur la typographie,
les couleurs et des filets dorés. Les emplacements « Cuvée à venir » montrent où les bouteilles prendront place.

## Pages

| Page | Contenu |
| --- | --- |
| `index.html` | Accueil : La Maison (concept), La Cave (Instagram + coordonnées), Nos vins (catégories, « Quand déguster ? », régions) |
| `nos-vins.html` | « Nos vins » : le catalogue, filtrable par **catégorie**, **région**, **consommation**, prix, recherche et tri |
| `vignerons.html` | « Nos vignerons » : carte de France des 92 vignerons (reprise de la carte Google du site actuel), filtrable par vignoble |
| `produit.html?id=…` | Fiche d'une bouteille |
| `mentions-legales.html` | Mentions légales, livraison et retrait |

## Héros « scroll vidéo » (accueil)

Le héros de l'accueil fait défiler la vidéo de la cave image par image au scroll (`js/hero-scroll.js`).
Deux vidéos générées sur Google Flow : **ordinateur** (16:9, 1920 × 1080) et **mobile** (9:16, 1080 × 1920),
7 s à 24 images/s chacune (168 images d'origine), sans filigrane visible (vérifié).

- 297 images par vidéo : les 168 images d'origine (toutes conservées, non recalculées) + 129 images
  interpolées (compensation de mouvement), placées dans les passages où la caméra bouge le plus ;
  `js/hero-time.js` donne la place des images d'origine pour chaque vidéo (la vidéo avance à vitesse
  constante au défilement) ; netteté renforcée seulement là où la vidéo d'origine est douce
- `assets/hero-frames/` : 297 WebP 1920 × 1080, qualité 74 (ordinateur, ~29 Mo)
- `assets/hero-frames-m/` : 297 WebP 810 × 1440, qualité 72 (mobile tenu en portrait, ~22 Mo ; l'écran
  est rendu au plus à 2× sa taille CSS)
- `assets/hero-frames-md/` : la vidéo ordinateur en 1600 × 900, qualité 74 (~23 Mo) : écrans jusqu'à
  ~1680 px (MacBook 13", portables 1366 / 1440 px) et ordinateurs modestes
- `assets/hero-frames-lo/` + `js/hero-lo.js` : version légère 512 × 288 (~3,5 Mo) en 4 paquets entrelacés
  (1 image sur 4 puis 1 sur 2 chargées en premier : la caméra ne se fige jamais pendant le chargement ;
  le reste de la bande passante va à la version nette, téléchargée d'abord devant le visiteur)
- `assets/hero-frames-lo-m/` + `js/hero-lo-m.js` : même chose pour le mobile (216 × 384, ~2,4 Mo)
- conteneur 320vh, écran collant plein écran ; mobile = largeur < 1024 px tenu en portrait
- fluidité : lissage du mouvement (ressort amorti à la molette), décodage en parallèle dans plusieurs
  travailleurs (`js/hero-worker.js`) ; cadre fixe et centré, la caméra avance tout droit
- dessin pixel pour pixel : le canvas a la résolution de l'image (partie visible), l'agrandissement
  éventuel est fait par la carte graphique — aucun filtre recalculé à chaque image
- Firefox : décodage par WebCodecs (`ImageDecoder`) dans les travailleurs, car son `createImageBitmap(Blob)`
  repasse par le fil principal et fige l'animation sur un ordinateur ancien ; repli `<img>.decode()`
- ordinateur modeste (≤ 4 cœurs ou ≤ 4 Go) : moteur allégé (2 décodeurs au plus, moins d'images en
  mémoire) ; Firefox sur ordinateur modeste : version 1600 × 900 d'emblée. Si l'écran n'est plus
  rafraîchi à temps pendant le mouvement, bascule automatique en 1600 × 900 (mémorisée 30 jours)
- netteté : jamais de fondu entre deux images (pas de double image) ; à l'arrêt, la caméra se pose
  sur une image d'origine ; la haute qualité est téléchargée en priorité autour de la position
- à l'ouverture, la page démarre toujours au début du héros (sauf lien interne vers une section)
- ouvert directement depuis le dossier (file://), un mode de secours prend le relais

## Où modifier quoi ?

Tout le contenu se pilote depuis **`js/data.js`** :

- `VDC.CONTACT` : adresse, téléphones, e-mail, horaires, Instagram, livraison, mentions légales
- `VDC.REGIONS` : les régions (nom + petite phrase de présentation)
- `VDC.CATEGORIES` : Fines bulles, Vins bio, Vins blancs, Vins rosés, Vins rouges
- `VDC.CONSOMMATIONS` : Plaisir immédiat, Attendre 2 à 3 ans, Belle garde, À mettre en cave
- `VDC.VIGNOBLES` / `VDC.VIGNERONS` : les vignerons de la carte (nom, vignoble, position, mot du caviste)
- `VDC.PRODUITS` : les bouteilles affichées (vide pour l'instant)

## Catalogue du site actuel (mis de côté)

Chaque bouteille du site actuel a été enregistrée avec sa **photo**, son **titre** et son **prix** :

- `donnees/catalogue-vinsdecopains.json` : 173 vins + 4 accessoires (avec, pour mémoire, le classement de l'ancien site)
- `donnees/catalogue-vinsdecopains.csv` : la même liste, lisible dans Excel
- `assets/bouteilles/` : les 177 photos, recadrées au même format

Exemple de bouteille :

```js
{
  id: "saint-joseph-domaine-bernard-gripa-2022",
  nom: "SAINT JOSEPH Domaine Bernard GRIPA 2022",
  prix: 31.80,
  image: "assets/bouteilles/saint-joseph-domaine-bernard-gripa-2022.jpg",
  region: "vallee-du-rhone",
  categories: ["vins-rouges"],          // + "vins-bio" si bio
  consommation: "plaisir-immediat",
  selection: true,                      // affichée dans « Nos coups de cœur »
  description: "…"
}
```

## Fichiers

```
index.html, cave.html, produit.html, mentions-legales.html
css/style.css          styles du site
js/data.js             données (catalogue, vignerons, coordonnées)
js/carte-france.js     fond de carte de France (Natural Earth, domaine public)
js/app.js              en-tête, pied de page, panier, recherche, contrôle d'âge
js/home.js | nos-vins.js | produit.js | vignerons.js   scripts propres à chaque page
js/hero-scroll.js      héros vidéo piloté par le défilement
js/hero-worker.js      décodage des images du héros en arrière-plan (plusieurs en parallèle)
js/hero-lo.js          index de la version légère du héros (fichier généré) — js/hero-lo-m.js (mobile)
assets/hero-frames/    images du héros (ordinateur) — hero-frames-md/ (ordinateur 1600 px) — hero-frames-m/ (mobile)
donnees/               catalogue du site actuel (JSON + CSV)
assets/bouteilles/     photos des bouteilles (reprises du site actuel, recadrées, pas encore affichées)
```

## À noter

- Le paiement en ligne n'est pas branché : le bouton « Valider ma commande » affiche un message d'attente.
- La newsletter n'est reliée à aucun service d'envoi pour l'instant.
