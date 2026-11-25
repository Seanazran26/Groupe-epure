# Lagrene Paysagiste 59 — nouveau site (maquette)

Nouveau site de **Lagrene Paysagiste 59** (Lille), refait à partir du site actuel
[www.lagrene-paysagiste.fr](https://www.lagrene-paysagiste.fr/) : **mêmes textes, mêmes photos, mêmes coordonnées,
mêmes adresses de pages**, avec un design neuf.

Site 100 % statique (HTML / CSS / JavaScript, sans installation) : il suffit d'ouvrir `index.html`
ou de déposer le dossier chez n'importe quel hébergeur.

L'analyse complète du site actuel (erreurs, photos, arguments de vente) est dans **`ANALYSE-SITE-ACTUEL.md`**.

## Pages (19, mêmes adresses que le site actuel)

| Page | Contenu |
| --- | --- |
| `index.html` | Accueil : héros (photo en arche, rappel immédiat), bandeau défilant, 8 services, élagage, **avant / après**, entretien, rapport qualité-prix, réalisations, zones + plan, devis |
| 7 pages services | `dessouchage-arbre-et-haie-59`, `taille-de-haie-59`, `creation-de-pelouse-59`, `abattage-arbres-et-haies-59`, `jardinier-59`, `elagueur-59`, `taille-de-haie-et-arbres-fruitiers-59` |
| 7 pages villes | `paysagiste-a-wattignies-59139`, `-wattrelos-59150`, `-roubaix-59100`, `-leers-59115`, `-hem-59510`, `-bondues-59910`, `-villeneuve-d-ascq-59491` |
| `realisations.html` | Avant / après, galerie avec visionneuse plein écran, « Bon à savoir » (règles de taille des haies) |
| `contact.html`, `devis-gratuit.html` | Formulaire + coordonnées (+ plan sur Contact) |
| `mentions-legales.html` | Mentions légales du site actuel, remises en forme |

## Où modifier quoi ?

- **Coordonnées, services, villes, nom de l'agence** → `js/data.js` (un seul endroit : l'en-tête, le menu,
  le pied de page et le bloc devis de toutes les pages se mettent à jour).
- **Couleurs, polices, arrondis** → les variables en haut de `css/style.css` (`--foret`, `--pousse`, `--creme`…).
- **Textes et photos d'une page** → directement dans le fichier `.html` de la page.

## Animations (prêtes à être enrichies)

- Ajoutez `data-apparition` à n'importe quel élément : il apparaît en fondu au défilement.
  Variantes : `data-apparition="gauche"`, `"droite"`, `"zoom"` ; décalage : `style="--delai:.2s"`.
- Ajoutez la classe `mots` à un titre : il s'affiche mot par mot.
- Ajoutez `data-profondeur` à l'image d'un bandeau : effet de profondeur au défilement.
- Déjà en place : photo du héros qui « respire », badge tournant, carte flottante, bandeau défilant,
  curseurs avant / après qui se présentent tout seuls, survols des cartes.
- Tout est désactivé automatiquement si le visiteur a choisi « réduire les animations » sur son appareil.

## Photos

- `images/bandeaux/` : bandeaux d'origine 1500 × 550 (non recompressés) + version 800 px.
- `images/photos/` : photos des sections, à leur taille d'origine (jamais agrandies au-delà).
- `images/realisations/` : les 17 photos de la galerie (WebP, bords de capture d'écran rognés) + vignettes 600 px.
- `images/avant-apres/` : les 2 avant / après découpés proprement (sans bandeaux ni bouton ✕).
- Les photos d'origine étant de petite taille, elles sont volontairement affichées à taille raisonnable
  pour rester nettes. **Avec les photos HD du client, tout le site gagnera encore en qualité.**

## Mise en ligne

- `.htaccess` (Apache / OVH) : sert les pages **sans `.html`** (ex. `/taille-de-haie-59`), comme le site actuel.
- `sitemap.xml` et `robots.txt` sont fournis.
- **Formulaires** : en démonstration, ils vérifient les champs et affichent un message, mais **n'envoient rien**.
  À brancher à la mise en ligne (PHP, Formspree, Brevo…) dans `js/site.js` (« Formulaires — DÉMO »).
- **Plan** : carte Google Maps intégrée (pages Accueil, Contact et villes).
- Les polices (Fraunces, Manrope — licence libre SIL OFL) sont hébergées dans `fonts/`.

## À compléter avec le client

Voir la liste en fin de `ANALYSE-SITE-ACTUEL.md` (photos HD, logo, avis, SIRET complet, nom de domaine…).
Le logo est une **proposition redessinée** d'après le logo actuel (arbre dans un arc de cercle).
