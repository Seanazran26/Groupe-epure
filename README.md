# Vin des Copains — nouveau site

Site vitrine et boutique de la cave **Vin des Copains** (Vieux-Lille), refait à partir du site actuel
[www.vinsdecopains.com](https://www.vinsdecopains.com/).

Site 100 % statique (HTML / CSS / JavaScript, sans installation) : il suffit d'ouvrir `index.html`
ou de déposer le dossier chez n'importe quel hébergeur.

## Pages

| Page | Contenu |
| --- | --- |
| `index.html` | Accueil : concept, univers (catégories), coups de cœur, « Quand déguster ? », régions, services, adresse, newsletter |
| `cave.html` | Le catalogue, filtrable par **catégorie**, **région**, **consommation**, prix, recherche et tri |
| `produit.html?id=…` | Fiche d'une bouteille |
| `mentions-legales.html` | Mentions légales, livraison et retrait |

## Où modifier quoi ?

Tout le contenu se pilote depuis **`js/data.js`** :

- `VDC.CONTACT` : adresse, téléphones, e-mail, horaires, Instagram, livraison, mentions légales
- `VDC.REGIONS` : les régions (nom + petite phrase de présentation)
- `VDC.CATEGORIES` : Fines bulles, Vins bio, Vins blancs, Vins rosés, Vins rouges
- `VDC.CONSOMMATIONS` : Plaisir immédiat, Attendre 2 à 3 ans, Belle garde, À mettre en cave
- `VDC.PRODUITS` : les 173 vins (titre, prix, photo, région, catégories, consommation, description)

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
js/data.js             données (catalogue + coordonnées)
js/app.js              en-tête, pied de page, panier, recherche, contrôle d'âge
js/home.js | cave.js | produit.js   scripts propres à chaque page
assets/bouteilles/     photos des bouteilles (reprises du site actuel, recadrées)
assets/img/            photos d'ambiance (Unsplash, libres de droits)
```

## À noter

- Le paiement en ligne n'est pas branché : le bouton « Valider ma commande » affiche un message d'attente.
- La newsletter n'est reliée à aucun service d'envoi pour l'instant.
