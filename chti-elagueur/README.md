# Le Ch’ti Élagueur — maquette du site

Maquette de site vitrine pour **Le Ch’ti Élagueur**, élagueur à **Lambersart (59130)**.
Même design que la maquette précédente (thème vert olive, ouverture animée, vidéo du jardin
au défilement, grille des services, livre des réalisations, arbre génératif).

## Coordonnées utilisées

| Élément | Valeur |
|---|---|
| Nom | Le Ch’ti Élagueur |
| Téléphone | 06 04 43 98 99 |
| Commune | Lambersart (59130) — pas de rue pour l’instant |
| E-mail | aucun pour l’instant (le formulaire et le téléphone suffisent) |
| SIRET, responsable de publication, hébergeur | à compléter (page Mentions légales) |
| Horaires affichés | Lun – Ven, 8 h – 19 h (**à confirmer avec le client**) |

Toutes ces données se changent dans `js/data.js` (en-tête, menu, pied de page, bloc devis).
Si une adresse e-mail ou une rue est ajoutée, elle s’affiche automatiquement.

## Services (d’après la fiche Google du client)

Une page par service, avec des textes rédigés pour lui :
Élagage d’arbres · Abattage d’arbres (même dangereux) · Taille de haies (à prix modérés) ·
Taille d’arbres · Dessouchage · Entretien de jardins et d’espaces verts · Évacuation des déchets verts.
Rien de ce qu’il ne propose pas (création de pelouse, aménagement paysager…).
Textes modifiables dans `outils/contenu_chti.py`, puis `python3 outils/generer.py` régénère les pages.

Avis Google affiché sur l’accueil : Miguel P., 5/5, « Équipe au top, super sympa, travaille carré. »

## Zones d’intervention

Déplacement dans tout le Nord (59) et le Pas-de-Calais (62). Une page par commune proche :

Lambersart (accueil) · Lille · Lomme · Saint-André-lez-Lille · La Madeleine ·
Marcq-en-Barœul · Wambrechies · Pérenchies

## Avant / après

`images/avant-apres/jardin-1-*` (jardin de ville remis en état) et `jardin-2-*`
(terrasse et massifs autour du bouleau), tirés des deux paires de photos fournies.

## À faire avant une mise en ligne

- Remplacer les photos des services, du livre et de la galerie par les photos du client :
  ce sont encore des photos d’une autre entreprise, utilisées seulement pour la présentation.
- Compléter SIRET, responsable de publication, hébergeur ; confirmer les horaires.
- Choisir le nom de domaine, puis le renseigner dans le générateur (canonical, sitemap).
- Brancher l’envoi réel des formulaires (aujourd’hui en mode démonstration).

## Mise en ligne sur Netlify

Déployer le contenu de ce dossier **sans** `outils/` ni `README.md` (le zip fourni est déjà prêt).
Le fichier `_headers` empêche Google d’indexer la maquette : supprimer la ligne `X-Robots-Tag`
le jour de la vraie mise en ligne.
