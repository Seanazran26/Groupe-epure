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
donnees/               catalogue du site actuel (JSON + CSV)
assets/bouteilles/     photos des bouteilles (reprises du site actuel, recadrées, pas encore affichées)
```

## À noter

- Le paiement en ligne n'est pas branché : le bouton « Valider ma commande » affiche un message d'attente.
- La newsletter n'est reliée à aucun service d'envoi pour l'instant.
