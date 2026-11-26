# Génère les pages du site « Le Ch’ti Élagueur » (Lambersart) : même design que la maquette précédente,
# textes adaptés au nouveau client (nom, téléphone, commune, villes), sans aucune donnée de l’ancien client.
import json, re, html, os
from PIL import Image
from bs4 import BeautifulSoup

SP = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.dirname(SP)   # le dossier du site (ce script est dans outils/)
BASE = ''          # pas encore de nom de domaine : pas d’URL absolue (canonical, sitemap) tant qu’il n’y en a pas
NB = '\u00a0'

# --------------------------------------------------------------------------- textes du client
# Tous les textes viennent de outils/contenu_chti.py, rédigés pour le Ch’ti Élagueur d’après sa fiche Google.
import sys
sys.path.insert(0, SP)
import contenu_chti as CC
SRC = CC.SRC

# --------------------------------------------------------------------------- texte
FIX = [
    (r'\bElagage\b', 'Élagage'), (r'\bElagueur\b', 'Élagueur'), (r'\bEtre\b', 'Être'),
    (r'haies magnifique et équilibrée', 'haies magnifiques et équilibrées'),
    (r'\bde tuya\b', 'de thuya'), (r'et transparent$', 'et transparents'),
    (r'Une équipe ouvert à tous projets', 'Une équipe ouverte à tous les projets'),
    (r'enchanté a ', 'enchanté à '), (r'^A ', 'À '),
    (r'immediatement', 'immédiatement'),
    (r'Villeneuve d ascq', "Villeneuve-d'Ascq"),
    (r'Contactez nous', 'Contactez-nous'),
]
def fix(t):
    t = re.sub(r'\s+', ' ', t).strip()
    for a, b in FIX:
        t = re.sub(a, b, t)
    t = t.rstrip(',').strip()
    t = re.sub(r'([a-zàâçéèêëîïôûùü])\.([A-ZÀÂÇÉÈÊ])', r'\1. \2', t)  # « défi.Pourtant » → « défi. Pourtant »
    t = re.sub(r"'", '’', t)
    t = re.sub(r'\s*([:;?!])(\s|$)', lambda m: NB + m.group(1) + m.group(2), t)  # espaces typographiques
    t = re.sub(r'(\d)' + NB + r':(\d)', r'\1:\2', t)
    return t

def esc(t):
    return html.escape(t, quote=False)

def sans_doublons(p):
    """Retire les phrases répétées dans un même paragraphe (fréquent sur l'ancien site)."""
    vues, garde = set(), []
    for ph in re.split(r'(?<=[.!?])\s+', p):
        cle = re.sub(r'\W+', '', ph.lower())
        if cle and cle in vues:
            continue
        vues.add(cle); garde.append(ph)
    return ' '.join(garde)

def avec_accroche(p):
    """Met la 1re phrase en valeur (classe .accroche)."""
    p = sans_doublons(fix(p))
    m = re.match(r'^(.{30,240}?[.!?])\s+(.+)$', p, re.S)
    if not m:
        return f'<p>{esc(p)}</p>'
    return f'<p><span class="accroche">{esc(m.group(1))}</span> {esc(m.group(2))}</p>'

def titre_em(t, mot):
    t = esc(fix(t))
    if mot:
        m = esc(fix(mot))
        i = t.lower().find(m.lower())
        if i >= 0:
            t = t[:i] + '<em>' + t[i:i + len(m)] + '</em>' + t[i + len(m):]
    return t

def blocs(flow):
    """Liste de (h2, p) depuis le contenu extrait."""
    out, cur = [], None
    for x in flow:
        if x[0] == 'H2':
            cur = [x[1], '']; out.append(cur)
        elif x[0] == 'P' and cur is not None:
            cur[1] = (cur[1] + ' ' + x[1]).strip()
    return out

# --------------------------------------------------------------------------- images
def dims(rel):
    with Image.open(os.path.join(OUT, rel)) as im:
        return im.size

def img(rel, alt, cls='', sizes=None, lazy=True, prio=False, attrs=''):
    w, h = dims(rel)
    srcset = ''
    petit = rel[:-5] + '-600.webp'
    if os.path.exists(os.path.join(OUT, petit)):
        pw, _ = dims(petit)
        srcset = f' srcset="{petit} {pw}w, {rel} {w}w" sizes="{sizes or "(max-width: 1020px) 92vw, 600px"}"'
    load = ' fetchpriority="high"' if prio else (' loading="lazy" decoding="async"' if lazy else '')
    c = f' class="{cls}"' if cls else ''
    return f'<img{c} src="{rel}"{srcset} alt="{esc(alt)}" width="{w}" height="{h}"{load}{attrs}>'

ALT = {
    'abattage-arbres-et-haies-1': 'Arbre abattu et dessouché, racines apparentes',
    'abattage-arbres-et-haies-2': 'Tronçonneuse posée sur un tronc fraîchement coupé',
    'abattage-arbres-et-haies-3': 'Élagueur équipé découpant un tronc à la tronçonneuse',
    'creation-de-pelouse-1': 'Déroulage d’un rouleau de gazon',
    'creation-de-pelouse-2': 'Pose de gazon en plaques sur une terre préparée',
    'creation-de-pelouse-3': 'Rouleau de gazon sur un sol ratissé',
    'dessouchage-arbre-et-haie-1': 'Rogneuse de souche au travail sur une pelouse',
    'dessouchage-arbre-et-haie-2': 'Rogneuse de souche sur chenilles',
    'dessouchage-arbre-et-haie-3': 'Rognage d’une souche, copeaux de bois',
    'elagage-1': 'Jardin paysager avec olivier, massif minéral et pelouse',
    'elagage-2': 'Terrasse en bois entourée de verdure',
    'elagage-3': 'Jardin contemporain en gravier blanc et dalles',
    'elagage-4': 'Terrasse en bois et salon de jardin au milieu des plantes',
    'elagage-5': 'Massif fleuri et olivier devant une maison moderne',
    'elagage-6': 'Entrée de maison paysagée avec olivier et galets',
    'elagueur-1': 'Élagueur encordé au sommet d’un arbre',
    'elagueur-2': 'Élagage d’un grand arbre, grimpeur en hauteur',
    'elagueur-3': 'Élagage d’un arbre avec une échelle',
    'jardinier-1': 'Taille de rosiers',
    'jardinier-2': 'Arrosage d’un massif de fleurs',
    'jardinier-3': 'Potager en carrés au soleil couchant',
    'taille-de-haie-1': 'Taille d’une haie au taille-haie thermique',
    'taille-de-haie-2': 'Taille-haie au-dessus d’une haie de jeunes pousses',
    'taille-de-haie-3': 'Cisaille électrique taillant une haie',
    'taille-de-haie-et-arbres-fruitiers-1': 'Haie de conifères à tailler : hauteur limitée à 2 mètres',
    'taille-de-haie-et-arbres-fruitiers-2': 'Taille d’une grande haie, jardinier au travail',
    'taille-de-haie-et-arbres-fruitiers-3': 'Haie de thuyas taillée en bordure de trottoir',
}
ALT_BANDEAU = {
    'accueil': 'Jardin en pente aménagé avec un escalier en pierres naturelles',
    'taille-de-haie-59': 'Taille d’une haie au sécateur',
    'dessouchage-arbre-et-haie-59': 'Rognage d’une souche d’arbre',
    'creation-de-pelouse-59': 'Pelouse dense et fraîchement poussée',
    'abattage-arbres-et-haies-59': 'Découpe d’un tronc à la tronçonneuse',
    'jardinier-59': 'Massif de fleurs bordant une pelouse',
    'elagueur-59': 'Élagueur encordé coupant une branche',
    'taille-de-haie-et-arbres-fruitiers-59': 'Allée bordée de haies taillées',
}

def ico(nom):
    P = {
        'tel': '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
        'fleche': '<path d="M4.5 12h15M13.5 6l6 6-6 6"/>',
        'diagonale': '<path d="M7 17 17 7M8.5 7H17v8.5"/>',
        'horloge': '<circle cx="12" cy="12" r="9.5"/><path d="M12 7v5l3.5 2"/>',
        'lieu': '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
        'coche': '<path d="M20 6 9 17l-5-5"/>',
        'feuille': '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10Z"/><path d="M2 21c0-3 1.9-5.4 5.2-6.1 2.4-.5 4.9-2 5.8-3.9"/>',
        'rappel': '<path d="M15.5 2.5v5h5"/><path d="m21 2-6 6"/><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
        'regle': '<path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.4 2.4 0 0 1 0-3.4l2.6-2.6a2.4 2.4 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2M11.5 9.5l2-2M8.5 6.5l2-2M17.5 15.5l2-2"/>',
    }
    cls = 'icon icon--fleche' if nom == 'fleche' else 'icon'
    return f'<svg class="{cls}" viewBox="0 0 24 24" aria-hidden="true">{P[nom]}</svg>'

TEL = '06 04 43 98 99'
TEL_LIEN = '+33604439899'

SERVICES = CC.SERVICES
VILLES = CC.VILLES
PAGES_SERVICES = CC.PAGES_SERVICES   # slug : (titre, mot en italique, bandeau, alt du bandeau, 3 photos)
def de(x):
    """« de taille de haies » mais « d’élagage d’arbres »."""
    return ('d’' if x[:1].lower() in 'aeiouyéèêh' else 'de ') + x

# --------------------------------------------------------------------------- gabarit
def page(nom, titre, description, corps, og='images/bandeaux/elagueur-59.webp', jsonld=None):
    url = BASE + ('/' if nom == 'index' else '/' + nom)
    canon = f'<link rel="canonical" href="{url}">\n' if BASE else ''
    og_url = f'<meta property="og:url" content="{url}">\n' if BASE else ''
    og_img = (BASE + '/' if BASE else '') + og
    ld = f'\n<script type="application/ld+json">{json.dumps(jsonld, ensure_ascii=False)}</script>' if jsonld else ''
    return f'''<!doctype html>
<html lang="fr" class="js-off">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(titre)}</title>
<meta name="description" content="{html.escape(description)}">
{canon}<meta property="og:type" content="website">
<meta property="og:locale" content="fr_FR">
<meta property="og:site_name" content="Le Ch’ti Élagueur">
<meta property="og:title" content="{html.escape(titre)}">
<meta property="og:description" content="{html.escape(description)}">
{og_url}<meta property="og:image" content="{og_img}">
<meta name="theme-color" content="#66733f">
<link rel="icon" href="images/favicon.svg" type="image/svg+xml">
<link rel="preload" href="fonts/fraunces-latin-full-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="fonts/manrope-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="css/style.css">
<script>document.documentElement.classList.remove("js-off"){'' if 'heros-scroll' not in corps else ';try{history.scrollRestoration="manual"}catch(e){}'}</script>
<script src="js/data.js" defer></script>
<script src="js/site.js" defer></script>
{'<script src="js/arbre.js" defer></script>' if nom == 'index' else ''}{ld}
</head>
<body{' class="page-accueil"' if nom == 'index' else ''}>
{OUVERTURE if nom == 'index' else ''}<div data-composant="entete"></div>
<main id="contenu">
{corps}
</main>
<div data-composant="pied"></div>
</body>
</html>
'''

def carte_service(i, s, autres=False):
    titre, lien, photo, accroche = s
    w, h = dims(photo)
    return (f'<a class="carte-service" href="{lien}" data-apparition style="--delai:{(i % 4) * 0.08:.2f}s">'
            f'<span class="photo"><img src="{photo}" alt="" width="{w}" height="{h}" loading="lazy" decoding="async"></span>'
            f'<span class="corps"><span class="numero">{i + 1:02d}</span><h3>{esc(titre)}</h3><p>{esc(accroche)}</p></span>'
            f'<span class="fleche">{ico("diagonale")}</span></a>')

def boutons_heros(clair=True, devis='#devis'):
    if clair:
        return (f'<div class="heros-actions"><a class="btn btn--pousse" href="{devis}">Devis gratuit {ico("fleche")}</a>'
                f'<a class="btn btn--contour-clair" data-tel href="tel:{TEL_LIEN}">{ico("tel")} {TEL}</a></div>')
    return (f'<div class="heros-actions"><a class="btn btn--primaire" href="{devis}">Demander un devis gratuit {ico("fleche")}</a>'
            f'<a class="btn btn--contour" data-tel href="tel:{TEL_LIEN}">{ico("tel")} {TEL}</a></div>')

def prose(sections, etiquette='', apres='', apparition='', h2_tag='h2'):
    parts = [f'<p class="etiquette">{esc(etiquette)}</p>'] if etiquette else []
    for h2, p in sections:
        if h2:
            parts.append(f'<{h2_tag}>{esc(fix(h2))}</{h2_tag}>')
        if p:
            parts.append(avec_accroche(p))
    a = f' data-apparition="{apparition}"' if apparition else ' data-apparition'
    return f'<div class="prose"{a}>' + ''.join(parts) + apres + '</div>'

def photo_duo(rel, alt, ratio, limite='limite-570', legende='', arche=False, apparition='droite'):
    w, h = dims(rel)
    leg = f'<span class="legende">{ico("feuille")} {esc(legende)}</span>' if legende else ''
    return (f'<div class="duo-photo {limite}{" cadre-arche" if arche else ""}" data-apparition="{apparition}">'
            f'<div class="cadre{" cadre--arche" if arche else ""}" style="aspect-ratio:{ratio}">'
            f'{img(rel, alt)}</div>{leg}</div>')

def mosaique():
    photos = [('r16', 'Élagueur encordé en hauteur dans un arbre'), ('r07', 'Haie de thuyas taillée au cordeau'),
              ('r06', 'Tronc d’arbre abattu, découpé en tronçons'), ('r14', 'Taille d’un arbre depuis une échelle')]
    figs = ''.join(f'<figure>{img(f"images/realisations/{r}-600.webp", alt)}</figure>' for r, alt in photos)
    return f'<div class="mosaique" data-apparition="droite">{figs}</div>'

FLECHES_BA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l-6 6 6 6M15 6l6 6-6 6"/></svg>'
def avant_apres(entete=True):
    def bloc(n, legende, alt_a, alt_b, delai):
        a = f'images/avant-apres/jardin-{n}-avant.webp'; b = f'images/avant-apres/jardin-{n}-apres.webp'
        w, h = dims(a)
        return (f'<figure class="ba-bloc" data-apparition style="--delai:{delai}s"><div class="ba">'
                f'<img src="{a}" alt="{alt_a}" width="{w}" height="{h}" loading="lazy">'
                f'<div class="ba-apres"><img src="{b}" alt="{alt_b}" width="{w}" height="{h}" loading="lazy"></div>'
                f'<span class="ba-ligne"></span><span class="ba-tag ba-tag--avant">Avant</span><span class="ba-tag ba-tag--apres">Après</span>'
                f'<input type="range" min="0" max="100" value="50" aria-label="Comparer avant et après : {legende}">'
                f'<span class="ba-poignee">{FLECHES_BA}</span></div>'
                f'<figcaption>{legende} <span>Glissez pour comparer</span></figcaption></figure>')
    tete = ('<div class="entete-section"><div><p class="etiquette">Avant / Après</p>'
            '<h2 class="mots">Le résultat, <em>en un geste</em></h2></div>'
            '<p>Faites glisser le curseur pour comparer le jardin avant et après l’intervention du Ch’ti Élagueur.</p></div>') if entete else ''
    return (tete + '<div class="avant-apres-grille">'
            + bloc(1, 'Remise en état d’un jardin de ville', 'Jardin à l’abandon : herbes folles, terre nue et dallage envahi', 'Le même jardin réaménagé : pelouse, massifs de lavande et allée en dalles claires', 0)
            + bloc(2, 'Jardin remis en état autour du bouleau', 'Jardin en pente : pelouse abîmée, talus de terre et marches usées devant la baie vitrée', 'Le même jardin : terrasse en bois, marches en pierre, jardinières en brique et massifs autour du bouleau', 0.12)
            + '</div>')

def bandeau(rel, alt, h2, p, etiquette, cta='Demander mon devis gratuit'):
    return (f'<section class="bandeau-photo">{img(rel, alt, attrs=" data-profondeur")}<div class="wrap">'
            f'<div class="bandeau-carte" data-apparition><p class="etiquette etiquette--clair">{esc(etiquette)}</p>'
            f'<h2>{esc(fix(h2))}</h2>{avec_accroche(p) if p else ""}'
            f'<a class="btn btn--pousse" href="#devis">{cta} {ico("fleche")}</a></div></div></section>')

def puces_villes(sauf=None, lille_lien=None):
    lille = f'<a class="principale" href="{lille_lien}">Lambersart <span>59130</span></a>' if lille_lien else '<span class="principale pastille-ville">Lambersart <span>59130</span></span>'
    return '<div class="puces-villes">' + lille + ''.join(
        f'<a href="{s}.html">{esc(v)} <span>{cp}</span></a>' for v, cp, s in VILLES if s != sauf) + '</div>'

PLAN = ('<div class="carte-plan" data-apparition="zoom"><iframe title="Plan : Lambersart (59130)" loading="lazy" '
        'referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=Lambersart+59130&amp;z=13&amp;output=embed"></iframe>'
        f'<div class="adresse-flottante">{ico("lieu")}<span><strong>Le Ch’ti Élagueur</strong><br>Lambersart (59130) · Nord et Pas-de-Calais</span></div></div>')

def zones(titre_html, texte, sauf=None, lille_lien=None):
    return (f'<section class="section section--sable" id="zones"><div class="wrap zones">'
            f'<div data-apparition><p class="etiquette">Zones d’intervention</p><h2>{titre_html}</h2><p>{texte}</p>{puces_villes(sauf, lille_lien)}</div>'
            f'{PLAN}</div></section>')

PLUS = '<span class="plus" aria-hidden="true"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></span>'
def accordeon(items):
    """Textes longs repliés sous leur titre d'origine (lisibles par Google, ouverts d'un clic)."""
    h = ''
    for titre, texte, balise, ident in items:
        i = f' id="{ident}"' if ident else ''
        h += (f'<details{i}><summary><{balise}>{esc(fix(titre))}</{balise}>{PLUS}</summary>'
              f'<div class="prose">{avec_accroche(texte)}</div></details>')
    return f'<div class="accordeon" data-apparition style="--delai:.1s">{h}</div>'

def zones_compactes():
    # Texte et 8 villes à gauche ; l'arbre génératif pousse à droite (sous les villes sur téléphone)
    return ('<section class="section section--sable zones-section" id="zones"><div class="wrap zones-compactes">'
            '<div class="zones-texte" data-apparition><p class="etiquette">Zones d’intervention</p><h2>Élagueur à <em>Lambersart</em>, dans le Nord et le Pas-de-Calais</h2>'
            '<p>Basé à Lambersart, le Ch’ti Élagueur se déplace dans tout le Nord (59) et le Pas-de-Calais (62). Voici les communes où il intervient le plus souvent.</p>'
            f'{puces_villes()}</div>'
            '<div class="zones-arbre" data-arbre data-speed="1" data-size="1" data-particles="1" aria-hidden="true"><canvas></canvas></div>'
            '</div></section>')

JSONLD = {
    "@context": "https://schema.org", "@type": "HomeAndConstructionBusiness",
    "name": "Le Ch’ti Élagueur", "telephone": TEL_LIEN,
    "address": {"@type": "PostalAddress", "postalCode": "59130", "addressLocality": "Lambersart", "addressCountry": "FR"},
    "openingHoursSpecification": [{"@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], "opens": "08:00", "closes": "19:00"}],
    "areaServed": ["Lambersart"] + [v for v, _, _ in VILLES] + ["Nord", "Pas-de-Calais"],
    "description": "Élagage, abattage d’arbres même dangereux, taille de haies à prix modérés, taille d’arbres, dessouchage, entretien de jardins et d’espaces verts, évacuation des déchets verts.",
}

def ecrire(nom, contenu):
    with open(os.path.join(OUT, nom + '.html'), 'w', encoding='utf-8') as f:
        f.write(contenu)

# =========================================================================== ACCUEIL
A = SRC['accueil']
s = blocs(A['flow'])
cartes = ''.join(carte_service(i, x) for i, x in enumerate(SERVICES))
defile_mots = ['Élagage', 'Abattage', 'Taille de haies', 'Taille d’arbres', 'Dessouchage', 'Entretien de jardins', 'Évacuation des déchets verts']
groupe = '<div class="defilant-groupe">' + ''.join(f'<span>{m}</span><span class="etoile"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10Z"/><path d="M2 21c0-3 1.9-5.4 5.2-6.1 2.4-.5 4.9-2 5.8-3.9"/></svg></span>' for m in defile_mots) + '</div>'
ruban_ids = [17, 8, 5, 6, 16, 7, 3, 12, 14, 9]
ruban_alt = {17: 'Élagage d’un grand arbre, élagueur au sommet', 8: 'Haie taillée en bordure d’un massif fleuri', 5: 'Taille d’une grande haie de thuyas',
             6: 'Élagueur équipé découpant un tronc', 16: 'Élagueur encordé en hauteur dans un arbre', 7: 'Haie de thuyas taillée au cordeau',
             3: 'Découpe d’une souche à la tronçonneuse', 12: 'Arbre abattu avec ses racines', 14: 'Élagage d’un arbre avec une échelle', 9: 'Haie taillée en bordure de trottoir'}
ruban = ''.join(f'<a href="realisations.html" aria-label="Voir les réalisations">{img(f"images/realisations/r{i:02d}-600.webp", ruban_alt[i])}</a>' for i in ruban_ids)

w_ar, h_ar = dims('images/bandeaux/elagueur-59.webp')

# --- Grille courbe « Nos services » : les photos des 8 services (images du site)
GRILLE = [  # une photo par service, dans l’ordre des services
    ('images/photos/elagueur-1.webp', 'Élagage d’arbres', 'Élagueur encordé au sommet d’un arbre'),
    ('images/photos/abattage-arbres-et-haies-3.webp', 'Abattage d’arbres', 'Élagueur découpant un tronc à la tronçonneuse'),
    ('images/photos/taille-de-haie-1.webp', 'Taille de haies', 'Taille d’une haie au taille-haie thermique'),
    ('images/realisations/r14.webp', 'Taille d’arbres', 'Taille d’un arbre depuis une échelle'),
    ('images/photos/dessouchage-arbre-et-haie-1.webp', 'Dessouchage', 'Retrait d’une souche dans une pelouse'),
    ('images/photos/taille-de-haie-2.webp', 'Entretien de jardins', 'Taille d’une haie de jeunes pousses'),
    ('images/realisations/r12.webp', 'Évacuation des déchets verts', 'Arbre abattu avec ses racines, prêt à être évacué'),
]
GRILLE_JSON = json.dumps([{'src': src, 'alt': alt, 'titre': titre, 'numero': f'{k + 1:02d}'} for k, (src, titre, alt) in enumerate(GRILLE)], ensure_ascii=False)
liens_services = ''.join(f'<a href="{lien}"><b>{k + 1:02d}</b>{esc(titre)}{ico("fleche")}</a>' for k, (titre, lien, _, _) in enumerate(SERVICES))

# --- Livre des réalisations : 10 chantiers (photos du site + commentaires du site)
ACCROCHE = {t: a for t, _, _, a in SERVICES}
CHANTIERS = [(17, 'Élagage d’arbres'), (8, 'Taille de haies'), (5, 'Taille de haies'), (6, 'Abattage d’arbres'), (16, 'Élagage d’arbres'),
             (7, 'Taille de haies'), (3, 'Dessouchage'), (12, 'Abattage d’arbres'), (14, 'Taille d’arbres'), (9, 'Taille de haies')]
LOGO_LIVRE = ('<svg class="logo-livre" viewBox="0 0 64 64" aria-hidden="true"><path d="M9 42a23 23 0 1 1 46 0" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>'
              '<g fill="#b5dd73"><circle cx="32" cy="22" r="9.5"/><circle cx="23" cy="27" r="7.5"/><circle cx="41" cy="27" r="7.5"/><circle cx="27.5" cy="32" r="6.5"/><circle cx="36.5" cy="32" r="6.5"/></g>'
              '<path d="M32 48V33M32 39l-5-4.5M32 37l5-4.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>'
              '<path d="M19 49h26" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>')
pages_livre = ('<div class="livre-page livre-couverture" data-density="hard"><div class="livre-feuille">' + LOGO_LIVRE +
               '<span class="sur">Le Ch’ti Élagueur</span><h3>Nos <em>réalisations</em></h3>'
               '<p>Dix chantiers en images</p></div></div>')
for n, (rid, service) in enumerate(CHANTIERS, 1):
    w, h = dims(f'images/realisations/r{rid:02d}.webp')
    pages_livre += (f'<div class="livre-page" data-chantier="{n}"><div class="livre-feuille">'
                    f'<div class="livre-haut"><span>Chantier {n:02d}</span><span>{esc(service)}</span></div>'
                    f'<div class="livre-photo"><img data-src="images/realisations/r{rid:02d}.webp" alt="{esc(ruban_alt[rid])}" width="{w}" height="{h}" decoding="async"></div>'
                    f'<div class="livre-texte"><h3>{esc(ruban_alt[rid])}</h3><p>{esc(ACCROCHE[service])}</p></div>'
                    f'<div class="livre-pied"><span>{n}</span><span>Le Ch’ti Élagueur</span></div></div></div>')
pages_livre += ('<div class="livre-page livre-couverture" data-density="hard"><div class="livre-feuille">' + LOGO_LIVRE +
                '<span class="sur">Devis gratuit</span><h3>Le prochain chantier, <em>c’est le vôtre</em></h3>'
                f'<p>Lun – Ven · 8{NB}h – 19{NB}h · {TEL}</p>'
                f'<a class="btn btn--pousse btn--petit" href="devis-gratuit.html">Demander un devis {ico("fleche")}</a></div></div>')
OUVERTURE = ('<div id="ouverture" aria-hidden="true"><canvas></canvas><div class="ouv-titre"><div class="ouv-nom">'
  + ''.join('<span>\u00a0</span>' if c == ' ' else f'<span>{c}</span>' for c in 'Le Ch’ti Élagueur') + '</div><div class="ouv-sous">Lambersart · 59</div></div></div>\n'
  '<script>(function(){var o=document.getElementById("ouverture"),k="chti-ouverture",vu=/chti-ouverture/.test(window.name);'
  'try{vu=sessionStorage.getItem(k)==="1";sessionStorage.setItem(k,"1")}catch(e){}'
  'try{if(!vu)window.name+=" "+k}catch(e){}'
  'var calme=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;'
  'if(vu||location.hash||calme){o.remove();return}'
  'var s=document.createElement("script");s.src="js/ouverture.js";document.head.appendChild(s)})()</script>\n')
nav_prec = f'<button class="livre-nav prec" type="button" aria-label="Page précédente">{ico("fleche")}</button>'
nav_suiv = f'<button class="livre-nav suiv" type="button" aria-label="Page suivante">{ico("fleche")}</button>'

ETOILE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2.6 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.4l-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9z"/></svg>'
AVIS = ('<figure class="avis" data-apparition><div class="avis-etoiles" role="img" aria-label="Note : 5 sur 5">' + ETOILE * 5 + '</div>'
        '<blockquote>« Équipe au top, super sympa, travaille carré. »</blockquote>'
        '<figcaption><span class="avis-initiale" aria-hidden="true">M</span><span><strong>Miguel P.</strong>Avis Google · 5/5</span></figcaption></figure>')
FLECHE_BAS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6"/></svg>'
corps = f'''<section class="heros-scroll" aria-label="Votre jardin se transforme">
  <div class="hs-scene">
    <picture class="hs-affiche">
      <source media="(max-width: 1023px)" srcset="images/hero-frames-sm/0001.webp">
      <img src="images/hero-frames/0001.webp" alt="Jardin laissé à l’abandon derrière une maison en brique ; au défilement, il se transforme en jardin soigné et fleuri" fetchpriority="high">
    </picture>
    <canvas aria-hidden="true"></canvas>
    <div class="hs-debut">
      <h1><span class="hs-nom">Le Ch’ti <em>Élagueur</em></span><span class="hs-accroche">Votre élagueur à Lambersart · Nord et Pas-de-Calais</span></h1>
      <p class="hs-indice">Faites défiler pour visiter <span class="hs-fleche">{FLECHE_BAS}</span></p>
    </div>
    <div class="hs-fin" aria-hidden="true">
      <div class="hs-fin-carte">
        <p class="hs-fin-titre">Votre jardin, <em>transformé</em>.</p>
        <p class="hs-fin-texte">Élagage, abattage, taille de haies, dessouchage et évacuation des déchets verts{NB}: le Ch’ti Élagueur s’occupe de vos arbres et de votre jardin, dans tout le Nord et le Pas-de-Calais.</p>
        <div class="hs-actions">
          <a class="btn btn--pousse" href="devis-gratuit.html">Demander un devis gratuit {ico("fleche")}</a>
          <a class="btn btn--contour-clair" data-tel href="tel:{TEL_LIEN}">{ico("tel")} {TEL}</a>
          <a class="btn btn--contour-clair" href="realisations.html">Nos réalisations</a>
        </div>
      </div>
    </div>
  </div>
</section>
<script src="js/heros-scroll.js" defer></script>

<div class="defilant" aria-hidden="true"><div class="defilant-piste">{groupe}{groupe}</div></div>

<section class="services-courbe" id="services">
  <div class="tgh" data-grille-courbe data-curve-mobile="58" data-speed="4" data-tile-height="26" data-aspect="16/9" data-gap="6" data-axis="56" data-curve="80" data-fade="12">
    <script type="application/json" class="tgh-images">{GRILLE_JSON}</script>
    <div class="tgh-contenu">
      <div><p class="etiquette">Nos services</p><h2 class="mots">Sept savoir-faire pour <em>vos arbres</em></h2></div>
      <p class="tgh-texte">De l’élagage à l’évacuation des déchets verts, le Ch’ti Élagueur s’occupe de tout, à Lambersart et dans tout le Nord et le Pas-de-Calais.</p>
    </div>
  </div>
  <div class="wrap"><nav class="services-liens" aria-label="Nos services">{liens_services}</nav></div>
</section>
<script src="js/grille-courbe.js" defer></script>

<section class="section section--foret fondus" id="avant-apres">
  <div class="wrap">
    {avant_apres()}
  </div>
</section>

<section class="section section--blanc livre-section" id="apercu-realisations">
  <div class="wrap">
    <div class="entete-section"><div><p class="etiquette">Réalisations</p><h2 class="mots">Nos chantiers <em>en images</em></h2></div>
    <p>Feuilletez nos réalisations : cliquez sur une page ou faites glisser son coin.</p></div>
    <div class="livre-scene">
      {nav_prec}
      <div class="livre" id="livre">{pages_livre}</div>
      {nav_suiv}
    </div>
    <div class="livre-bas">
      <div class="livre-mobile-nav">{nav_prec}{nav_suiv}</div>
      <p class="livre-compteur" aria-live="polite">Couverture</p>
      <a class="btn btn--contour" href="realisations.html">Toutes les réalisations {ico("fleche")}</a>
    </div>
  </div>
</section>
<script src="js/vendor/page-flip.browser.js" defer></script>
<script src="js/livre.js" defer></script>

<section class="section section--papier" id="savoir-faire">
  <div class="wrap intro-grille">
    <div data-apparition>
      <p class="etiquette">Notre approche</p>
      <p class="intro-titre">Des arbres sains, des haies nettes et <em>un chantier rendu propre</em>.</p>
      <ul class="points">
        <li><span class="rond-icone">{ico("coche")}</span>Devis gratuit</li>
        <li><span class="rond-icone">{ico("horloge")}</span>Du lundi au vendredi, de 8{NB}h à 19{NB}h</li>
        <li><span class="rond-icone">{ico("lieu")}</span>Nord (59) et Pas-de-Calais (62)</li>
      </ul>
      {AVIS}
      <form class="rappel" data-formulaire="rappel">
        <label class="rappel-label" for="rappel-tel">{ico("rappel")} Être rappelé immédiatement</label>
        <div class="rappel-champ"><input id="rappel-tel" name="numtel" type="tel" placeholder="Votre téléphone" autocomplete="tel" required><button class="btn btn--pousse" type="submit">Me rappeler</button></div>
      </form>
    </div>
    {accordeon([("Le Ch’ti Élagueur, votre élagueur à Lambersart", A['intro'], 'h3', 'approche')] + [(h, p, 'h2', '') for h, p in s])}
  </div>
</section>

{zones_compactes()}

<div data-composant="devis"></div>'''
ecrire('index', page('index', 'Le Ch’ti Élagueur — élagage, abattage et taille de haies à Lambersart',
                     'Élagueur à Lambersart (59130) : élagage, abattage d’arbres même dangereux, taille de haies à prix modérés, dessouchage, entretien de jardins et évacuation des déchets verts. Déplacement dans tout le Nord et le Pas-de-Calais. Devis gratuit au 06 04 43 98 99.',
                     corps, jsonld=JSONLD))

# =========================================================================== SERVICES
noms = list(PAGES_SERVICES)
for k, (titre, mot, bandeau_k, alt_bandeau_k, photos_k) in PAGES_SERVICES.items():
    d = SRC[k]
    s = blocs(d['flow'])
    ph = [p for p, _ in photos_k]
    alts = [a for _, a in photos_k]
    r = [dims(p) for p in ph]
    ici = next(i for i, x in enumerate(SERVICES) if x[1] == k + '.html')
    autres = [SERVICES[(ici + j) % len(SERVICES)] for j in range(1, 5)]
    autres_html = ''.join(carte_service(SERVICES.index(x), x) for x in autres)
    bas = titre[0].lower() + titre[1:]
    corps = f'''<section class="page-heros">
  {img(bandeau_k, alt_bandeau_k, lazy=False, prio=True)}
  <div class="wrap">
    <ol class="fil"><li><a href="index.html">Accueil</a></li><li><a href="index.html#services">Services</a></li><li aria-current="page">{esc(titre)}</li></ol>
    <h1 class="mots">{titre_em(d['h1'], mot)}</h1>
    {boutons_heros()}
  </div>
</section>

<section class="section">
  <div class="wrap intro-page">
    <div class="prose" data-apparition><p class="etiquette">{esc(titre)} à Lambersart</p>{avec_accroche(d['intro'])}</div>
    <aside class="carte-contact" data-apparition="droite">
      <h3>Un projet {esc(de(bas))}{NB}?</h3>
      <p>Devis gratuit, à Lambersart et dans les environs.</p>
      <a class="tel-geant" data-tel href="tel:{TEL_LIEN}">{ico("tel")} {TEL}</a>
      <p class="horaires">{ico("horloge")} Lun – Ven · 8{NB}h – 19{NB}h</p>
      <a class="btn btn--primaire btn--bloc" href="#devis">Demander un devis {ico("fleche")}</a>
    </aside>
  </div>
</section>

<section class="section section--papier">
  <div class="wrap blocs">
    <div class="duo">
      {prose(s[0:1], 'Notre savoir-faire', '', 'gauche')}
      {photo_duo(ph[0], alts[0], f"{r[0][0]} / {r[0][1]}")}
    </div>
    <div class="duo duo--inverse">
      {prose(s[1:3], '', '', 'droite')}
      {photo_duo(ph[1], alts[1], f"{r[1][0]} / {r[1][1]}", legende=titre, apparition='gauche')}
    </div>
    <div class="duo">
      {prose(s[3:5], '', f'<a class="btn btn--primaire" href="#devis">Demander un devis gratuit {ico("fleche")}</a>', 'gauche')}
      {photo_duo(ph[2], alts[2], f"{r[2][0]} / {r[2][1]}", arche=True)}
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="entete-section"><div><p class="etiquette">Nos autres services</p><h2>Tout pour <em>votre extérieur</em></h2></div>
    <a class="lien-fleche" href="index.html#services">Voir tous les services {ico("fleche")}</a></div>
    <div class="autres-services">{autres_html}</div>
  </div>
</section>

<div data-composant="devis" data-titre="Un projet {'d’' if de(bas).startswith('d’') else 'de '}<em>{esc(bas)}</em>{NB}?" data-service="{esc(titre)}"></div>'''
    ecrire(k, page(k, fix(d['title']), d['description'], corps, og=bandeau_k))

# =========================================================================== VILLES
for ville, cp, k in VILLES:
    d = SRC[k]
    s = blocs(d['flow'])
    # Titres en double sur le site actuel : on garde le premier, le second devient une étiquette
    s2_titre = s[2][0] if fix(s[2][0]) != fix(s[1][0]) else ''
    etiq2 = '' if s2_titre else f'Élagueur à {ville}'
    cartes = ''.join(carte_service(i, x) for i, x in enumerate(SERVICES))
    p4 = s[4][1]
    corps = f'''<section class="page-heros">
  {img("images/bandeaux/elagueur-59.webp", "Élagueur encordé coupant une branche", lazy=False, prio=True)}
  <div class="wrap">
    <ol class="fil"><li><a href="index.html">Accueil</a></li><li><a href="index.html#zones">Zones d’intervention</a></li><li aria-current="page">{esc(ville)}</li></ol>
    <h1 class="mots">{titre_em(d['h1'], ville.replace('’', "'"))}</h1>
    {boutons_heros()}
  </div>
</section>

<section class="section">
  <div class="wrap intro-page">
    <div class="prose" data-apparition><p class="etiquette">Élagueur à {esc(ville)} · {cp}</p>{avec_accroche(d['intro'])}</div>
    <aside class="carte-contact" data-apparition="droite">
      <h3>Votre jardin à {esc(ville)}</h3>
      <p>Devis gratuit pour tous vos travaux de jardin à {esc(ville)} ({cp}).</p>
      <a class="tel-geant" data-tel href="tel:{TEL_LIEN}">{ico("tel")} {TEL}</a>
      <p class="horaires">{ico("horloge")} Lun – Ven · 8{NB}h – 19{NB}h</p>
      <a class="btn btn--primaire btn--bloc" href="#devis">Demander un devis {ico("fleche")}</a>
    </aside>
  </div>
</section>

<section class="section section--papier">
  <div class="wrap blocs">
    <div class="duo duo--inverse">
      {prose(s[0:2], 'Notre savoir-faire', '', 'droite')}
      {photo_duo('images/realisations/r05.webp', 'Taille d’une grande haie de thuyas', '1200 / 691', 'limite-950', f'{ville} · {cp}', apparition='gauche')}
    </div>
    <div class="duo">
      {prose([(s2_titre, s[2][1])], etiq2, '', 'gauche')}
      {mosaique()}
    </div>
  </div>
</section>

{bandeau('images/bandeaux/taille-de-haie-et-arbres-fruitiers-59.webp', ALT_BANDEAU['taille-de-haie-et-arbres-fruitiers-59'], s[3][0], s[3][1], f'Élagueur à {ville}')}

<section class="section">
  <div class="wrap duo duo--inverse">
    {prose([(s[4][0], p4)], 'Votre projet', boutons_heros(clair=False), 'droite')}
    {photo_duo('images/realisations/r03.webp', 'Découpe d’une souche à la tronçonneuse', '1200 / 801', 'limite-950', 'Abattage et dessouchage', apparition='gauche')}
  </div>
</section>

<section class="section section--papier">
  <div class="wrap">
    <div class="entete-section"><div><p class="etiquette">Nos services à {esc(ville)}</p><h2>Sept savoir-faire pour <em>vos arbres</em></h2></div>
    <p>Élagage, abattage, haies, dessouchage, entretien et évacuation des déchets verts{NB}: le Ch’ti Élagueur intervient à {esc(ville)} ({cp}).</p></div>
    <div class="services-grille">{cartes}</div>
  </div>
</section>

{zones(f"Nous intervenons aussi <em>près de chez vous</em>", f"Depuis Lambersart, le Ch’ti Élagueur se déplace à {esc(ville)} et dans toutes les communes voisines.", sauf=k, lille_lien="index.html")}

<div data-composant="devis" data-titre="Votre jardin à <em>{esc(ville)}</em>"></div>'''
    ecrire(k, page(k, fix(d['title']), d['description'], corps))

# =========================================================================== RÉALISATIONS
R = SRC['realisations']
gal_alt = {1: 'Pose de gazon en rouleaux sur une terre préparée', 2: 'Déroulage d’un rouleau de gazon', 3: 'Découpe d’une souche à la tronçonneuse',
           4: 'Pose de gazon en plaques le long d’une allée', 5: 'Taille d’une grande haie de thuyas', 6: 'Élagueur équipé découpant un tronc',
           7: 'Haie de thuyas taillée au cordeau', 8: 'Haie taillée en bordure d’un massif fleuri', 9: 'Haie taillée en bordure de trottoir',
           12: 'Arbre abattu et dessouché', 14: 'Élagage d’un arbre avec une échelle', 16: 'Élagueur encordé en hauteur dans un arbre',
           17: 'Élagage d’un grand arbre, élagueur au sommet'}
ordre = [17, 5, 6, 8, 16, 7, 12, 14, 9, 3]
galerie = ''.join(f'<a href="images/realisations/r{i:02d}.webp" data-visionneuse="galerie" data-apparition style="--delai:{(n % 3) * 0.06:.2f}s">'
                  f'{img(f"images/realisations/r{i:02d}-600.webp", gal_alt[i])}</a>' for n, i in enumerate(ordre))
corps = f'''<section class="page-heros page-heros--court">
  {img("images/bandeaux/elagueur-59.webp", ALT_BANDEAU["elagueur-59"], lazy=False, prio=True)}
  <div class="wrap">
    <ol class="fil"><li><a href="index.html">Accueil</a></li><li aria-current="page">Réalisations</li></ol>
    <h1 class="mots">Nos <em>réalisations</em></h1>
  </div>
</section>

<section class="section section--foret">
  <div class="wrap">{avant_apres()}</div>
</section>

<section class="section">
  <div class="wrap">
    <div class="entete-section"><div><p class="etiquette">Galerie</p><h2 class="mots">Élagage, abattage, <em>haies</em>…</h2></div>
    <p>Voici les photos de nos réalisations. Touchez une photo pour l’agrandir.</p></div>
    <div class="galerie">{galerie}</div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="bon-a-savoir" data-apparition>
      <div>
        <p class="etiquette">Bon à savoir</p>
        <h2>Haies en bordure de rue{NB}: <em>la règle</em></h2>
        <ul>
          <li>{ico("coche")}<span>Les haies doivent être taillées à l’aplomb du domaine public (rue, trottoir, grillage…).</span></li>
          <li>{ico("regle")}<span>Leur hauteur doit être limitée à 2{NB}mètres, voire moins là où la visibilité est primordiale (virage, carrefour…).</span></li>
          <li>{ico("coche")}<span>En bordure des voies publiques, l’élagage des arbres et des haies incombe au propriétaire (ou au locataire), qui doit veiller à ce que rien ne dépasse de sa clôture sur la rue.</span></li>
        </ul>
        <p style="margin-top:22px">Merci de respecter cette règle, pour le bien-être et la sécurité de tous{NB}! Besoin d’une remise à niveau de votre haie{NB}? <a class="lien-fleche" href="taille-de-haies.html">Taille de haies {ico("fleche")}</a></p>
      </div>
      <div class="vignettes">
        <a href="images/realisations/r10.webp" data-visionneuse="regle">{img("images/realisations/r10-600.webp", "Haie de conifères à tailler : hauteur limitée à 2 mètres")}</a>
        <a href="images/realisations/r11.webp" data-visionneuse="regle">{img("images/realisations/r11-600.webp", "Affiche : règles de taille des haies en bordure de voie publique")}</a>
      </div>
    </div>
  </div>
</section>

<div data-composant="devis" data-titre="Le prochain chantier, <em>c’est le vôtre</em>"></div>'''
ecrire('realisations', page('realisations', 'Réalisations — Le Ch’ti Élagueur', R['description'], corps, og='images/realisations/r17.webp'))

# =========================================================================== CONTACT
corps = f'''<section class="page-heros page-heros--court">
  {img("images/bandeaux/jardinier-59.webp", ALT_BANDEAU["jardinier-59"], lazy=False, prio=True)}
  <div class="wrap">
    <ol class="fil"><li><a href="index.html">Accueil</a></li><li aria-current="page">Contact</li></ol>
    <h1 class="mots">Contactez-<em>nous</em></h1>
    <p style="max-width:40em;opacity:.9;margin:0">Vous avez des questions{NB}? N’hésitez pas à nous demander, nous vous répondrons dans les meilleurs délais.</p>
  </div>
</section>

<div data-composant="devis" data-titre="Une question{NB}? <em>Écrivez-nous</em>"></div>

{zones("Nous trouver à <em>Lambersart</em>", "Le Ch’ti Élagueur est basé à Lambersart (59130) et se déplace dans tout le Nord et le Pas-de-Calais.")}'''
ecrire('contact', page('contact', 'Contactez-nous — Le Ch’ti Élagueur', 'Contactez le Ch’ti Élagueur, élagueur à Lambersart : 06 04 43 98 99. Devis gratuit pour l’élagage, l’abattage, la taille de haies, le dessouchage et l’entretien de jardin.', corps, jsonld=JSONLD))

# =========================================================================== DEVIS GRATUIT
corps = f'''<section class="page-heros page-heros--court">
  {img("images/bandeaux/taille-de-haie-59.webp", ALT_BANDEAU["taille-de-haie-59"], lazy=False, prio=True)}
  <div class="wrap">
    <ol class="fil"><li><a href="index.html">Accueil</a></li><li aria-current="page">Devis gratuit</li></ol>
    <h1 class="mots">Demandez votre devis <em>gratuitement</em></h1>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="etapes">
      <div class="etape" data-apparition><h3>Vous décrivez votre projet</h3><p>Quelques mots suffisent{NB}: élagage, abattage, haie, souche, entretien…</p></div>
      <div class="etape" data-apparition style="--delai:.1s"><h3>Nous vous recontactons</h3><p>Du lundi au vendredi, de 8{NB}h à 19{NB}h, pour préciser vos besoins.</p></div>
      <div class="etape" data-apparition style="--delai:.2s"><h3>Vous recevez votre devis</h3><p>Un devis clair et gratuit, adapté à votre jardin.</p></div>
    </div>
  </div>
</section>

<div data-composant="devis" data-titre="Votre <em>devis gratuit</em>"></div>'''
ecrire('devis-gratuit', page('devis-gratuit', 'Devis gratuit — Le Ch’ti Élagueur', 'Demandez votre devis gratuit au Ch’ti Élagueur : élagage, abattage d’arbres, taille de haies, dessouchage, entretien de jardins et évacuation des déchets verts, à Lambersart et dans tout le Nord et le Pas-de-Calais.', corps))

# =========================================================================== MENTIONS LÉGALES
A_COMPLETER = '<span class="a-completer">à compléter</span>'
legal = [
    '<h2>Éditeur du site</h2>',
    '<p><strong>Entreprise' + NB + ':</strong> Le Ch’ti Élagueur</p>',
    '<p><strong>Commune' + NB + ':</strong> Lambersart (59130)</p>',
    f'<p><strong>Téléphone{NB}:</strong> <a href="tel:{TEL_LIEN}">{TEL}</a></p>',
    '<p><strong>SIRET' + NB + ':</strong> ' + A_COMPLETER + '</p>',
    '<p><strong>Responsable de la publication' + NB + ':</strong> ' + A_COMPLETER + '</p>',
    '<h2>Conception et hébergement</h2>',
    '<p><strong>Conception' + NB + ':</strong> <span data-c="agence">Groupe Épure</span></p>',
    '<p><strong>Hébergement' + NB + ':</strong> ' + A_COMPLETER + ' (précisé à la mise en ligne)</p>',
    '<h2>Propriété intellectuelle</h2>',
    '<p>Les textes, photos et éléments graphiques de ce site sont protégés. Toute reproduction, même partielle, sans autorisation écrite est interdite.</p>',
    '<h2>Données personnelles</h2>',
    f'<p>Les informations envoyées par les formulaires (nom, téléphone, e-mail, message) servent uniquement à répondre à votre demande de devis ou de rappel. Elles ne sont ni vendues ni cédées. Vous pouvez demander à les consulter, les corriger ou les supprimer en appelant le <a href="tel:{TEL_LIEN}">{TEL}</a>.</p>',
    '<h2>Cookies</h2>',
    '<p>Ce site ne dépose aucun cookie publicitaire ni de mesure d’audience. Les cartes affichées sur certaines pages sont fournies par Google Maps, qui peut déposer ses propres cookies.</p>',
]
corps = f'''<section class="page-heros page-heros--court">
  {img("images/bandeaux/abattage-arbres-et-haies-59.webp", ALT_BANDEAU["abattage-arbres-et-haies-59"], lazy=False, prio=True)}
  <div class="wrap">
    <ol class="fil"><li><a href="index.html">Accueil</a></li><li aria-current="page">Mentions légales</li></ol>
    <h1 class="mots">Mentions <em>légales</em></h1>
    <p style="opacity:.85;margin:0">Mise à jour{NB}: septembre 2026</p>
  </div>
</section>

<section class="section">
  <div class="wrap texte-legal">
    {''.join(legal)}
  </div>
</section>'''
ecrire('mentions-legales', page('mentions-legales', 'Mentions légales — Le Ch’ti Élagueur', 'Mentions légales du site du Ch’ti Élagueur, élagueur à Lambersart.', corps))

# =========================================================================== fichiers techniques
toutes = ['index'] + noms + [k for _, _, k in VILLES] + ['realisations', 'contact', 'devis-gratuit', 'mentions-legales']
if BASE:
    with open(os.path.join(OUT, 'sitemap.xml'), 'w', encoding='utf-8') as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
        for n in toutes:
            f.write(f'  <url><loc>{BASE}{"/" if n == "index" else "/" + n}</loc></url>\n')
        f.write('</urlset>\n')
with open(os.path.join(OUT, 'robots.txt'), 'w', encoding='utf-8') as f:
    f.write('User-agent: *\nAllow: /\n' + (f'Sitemap: {BASE}/sitemap.xml\n' if BASE else ''))
print('pages :', len(toutes))
