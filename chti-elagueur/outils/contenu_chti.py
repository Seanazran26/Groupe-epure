# Textes du site « Le Ch’ti Élagueur » — rédigés pour ce client, d’après sa fiche Google :
#   taille de haies (à prix modérés), abattage d’arbres (y compris dangereux), élagage, taille d’arbres,
#   dessouchage, entretien de jardins et d’espaces verts, évacuation des déchets verts ;
#   déplacement dans tout le Nord (59) et le Pas-de-Calais (62).
# Rien de ce qu’il ne propose pas (création de pelouse, aménagement paysager, plantation…).
# Format repris par le générateur : title, description, h1, intro, flow = [['H2', titre], ['P', texte], …]

TEL = '06 04 43 98 99'
ZONE = 'tout le Nord et le Pas-de-Calais'


def flow(sections):
    f = []
    for h, p in sections:
        f += [['H2', h], ['P', p]]
    return f


def devis(service):
    return ('Votre devis, gratuit',
            f'Décrivez-nous {service} par téléphone au {TEL} ou avec le formulaire. Nous venons voir le chantier '
            f'et nous vous remettons un devis clair, gratuit et sans engagement. Nous intervenons à Lambersart, '
            f'dans la métropole lilloise et dans {ZONE}.')


# --------------------------------------------------------------------------- services
# slug : titre court, mot mis en italique dans le H1, bandeau, texte alternatif du bandeau, 3 photos (chemin, alt)
PAGES_SERVICES = {
    'elagage-arbres': ('Élagage d’arbres', 'Élagage d’arbres',
                       'images/bandeaux/elagueur-59.webp', 'Élagueur encordé coupant une branche', [
                           ('images/photos/elagueur-1.webp', 'Élagueur encordé au sommet d’un arbre'),
                           ('images/photos/elagueur-2.webp', 'Élagage d’un grand arbre, grimpeur en hauteur'),
                           ('images/realisations/r16.webp', 'Élagueur encordé en hauteur dans un arbre')]),
    'abattage-arbres': ('Abattage d’arbres', 'même dangereux',
                        'images/bandeaux/abattage-arbres-et-haies-59.webp', 'Découpe d’un tronc à la tronçonneuse', [
                            ('images/photos/abattage-arbres-et-haies-3.webp', 'Élagueur équipé découpant un tronc à la tronçonneuse'),
                            ('images/realisations/r06.webp', 'Tronc d’arbre abattu, découpé en tronçons'),
                            ('images/photos/abattage-arbres-et-haies-1.webp', 'Arbre abattu, racines apparentes')]),
    'taille-de-haies': ('Taille de haies', 'prix modérés',
                        'images/bandeaux/taille-de-haie-59.webp', 'Taille d’une haie au sécateur', [
                            ('images/photos/taille-de-haie-1.webp', 'Taille d’une haie au taille-haie thermique'),
                            ('images/photos/taille-de-haie-et-arbres-fruitiers-2.webp', 'Taille d’une grande haie'),
                            ('images/photos/taille-de-haie-et-arbres-fruitiers-3.webp', 'Haie de thuyas taillée en bordure de trottoir')]),
    'taille-arbres': ('Taille d’arbres', 'Taille d’arbres',
                      'images/bandeaux/taille-de-haie-et-arbres-fruitiers-59.webp', 'Allée bordée d’arbres et de haies taillés', [
                          ('images/realisations/r14.webp', 'Taille d’un arbre depuis une échelle'),
                          ('images/photos/elagueur-3.webp', 'Taille d’un arbre avec une échelle'),
                          ('images/photos/jardinier-1.webp', 'Taille d’un arbuste au sécateur')]),
    'dessouchage': ('Dessouchage', 'Dessouchage',
                    'images/bandeaux/dessouchage-arbre-et-haie-59.webp', 'Retrait d’une souche d’arbre', [
                        ('images/photos/dessouchage-arbre-et-haie-1.webp', 'Retrait d’une souche dans une pelouse'),
                        ('images/photos/dessouchage-arbre-et-haie-2.webp', 'Machine de dessouchage sur chenilles'),
                        ('images/photos/dessouchage-arbre-et-haie-3.webp', 'Souche en cours de retrait')]),
    'entretien-jardins': ('Entretien de jardins', 'espaces verts',
                          'images/bandeaux/jardinier-59.webp', 'Jardin entretenu, massif et pelouse', [
                              ('images/photos/taille-de-haie-2.webp', 'Taille d’une haie de jeunes pousses'),
                              ('images/photos/jardinier-1.webp', 'Taille d’un arbuste au sécateur'),
                              ('images/photos/taille-de-haie-3.webp', 'Taille d’une bordure à la cisaille')]),
    'evacuation-dechets-verts': ('Évacuation des déchets verts', 'déchets verts',
                                 'images/bandeaux/evacuation-dechets-verts.webp', 'Arbre abattu prêt à être découpé et évacué', [
                                     ('images/photos/abattage-arbres-et-haies-2.webp', 'Tronçonneuse posée sur un tronc fraîchement coupé'),
                                     ('images/realisations/r12.webp', 'Arbre abattu avec ses racines, prêt à être évacué'),
                                     ('images/realisations/r03.webp', 'Découpe d’une souche à la tronçonneuse')]),
}

# (titre, lien, photo de carte, accroche) — même ordre partout (menus, cartes, devis)
SERVICES = [
    ('Élagage d’arbres', 'elagage-arbres.html', 'images/photos/elagueur-1.webp', 'Des arbres sains, sûrs et bien dessinés.'),
    ('Abattage d’arbres', 'abattage-arbres.html', 'images/photos/abattage-arbres-et-haies-3.webp', 'Même les arbres dangereux, en toute sécurité.'),
    ('Taille de haies', 'taille-de-haies.html', 'images/photos/taille-de-haie-1.webp', 'Des haies nettes, à prix modérés.'),
    ('Taille d’arbres', 'taille-arbres.html', 'images/photos/elagueur-3.webp', 'Arbres d’ornement et fruitiers, taillés avec soin.'),
    ('Dessouchage', 'dessouchage.html', 'images/photos/dessouchage-arbre-et-haie-1.webp', 'Souches retirées, terrain dégagé.'),
    ('Entretien de jardins', 'entretien-jardins.html', 'images/photos/taille-de-haie-2.webp', 'Jardins et espaces verts, toute l’année.'),
    ('Évacuation des déchets verts', 'evacuation-dechets-verts.html', 'images/photos/abattage-arbres-et-haies-2.webp', 'Branches, troncs, feuilles : on emporte tout.'),
]

SRC = {}
SRC['elagage-arbres'] = {
    'title': 'Élagage d’arbres à Lambersart — Le Ch’ti Élagueur',
    'description': f'Élagage d’arbres à Lambersart et dans {ZONE} : branches mortes, ramure trop dense, branches gênantes. Chantier propre, déchets évacués. Devis gratuit au {TEL}.',
    'h1': 'Élagage d’arbres à Lambersart et alentour',
    'intro': 'Un arbre bien élagué est plus sain, plus sûr et plus beau. Le Ch’ti Élagueur intervient sur tous les arbres de votre jardin : branches mortes, ramure trop dense, branches qui touchent la toiture, la façade ou les fils. Nous travaillons en hauteur, proprement, et nous repartons avec les déchets verts.',
    'flow': flow([
        ('Pourquoi faire élaguer vos arbres ?', 'L’élagage retire le bois mort et les branches fragiles avant qu’elles ne tombent. Il laisse passer la lumière, limite la prise au vent et évite les ennuis avec la gouttière, la ligne électrique ou le voisin. Bien fait, il prolonge la vie de l’arbre au lieu de l’affaiblir.'),
        ('Une coupe adaptée à chaque arbre', 'Chaque essence réagit différemment à la coupe. Nous coupons au bon endroit, sans arracher l’écorce, et nous ne retirons que le nécessaire : une éclaircie pour aérer, une réduction pour contenir un arbre devenu trop grand, ou la suppression des branches dangereuses.'),
        ('Le bon moment pour élaguer', 'La plupart des arbres s’élaguent pendant leur repos, de la fin de l’automne à la fin de l’hiver. Une branche morte ou cassée, elle, se retire à tout moment de l’année. Nous vous indiquons la meilleure période au moment du devis.'),
        ('Un chantier propre, du début à la fin', 'Les branches coupées sont descendues avec soin pour protéger vos plantations, votre toiture et votre clôture. À la fin, tout est ramassé et les déchets verts sont évacués : vous retrouvez un jardin net.'),
        devis('vos arbres'),
    ]),
}
SRC['abattage-arbres'] = {
    'title': 'Abattage d’arbres, même dangereux — Le Ch’ti Élagueur, Lambersart',
    'description': f'Abattage d’arbres à Lambersart et dans {ZONE} : arbres morts, malades ou dangereux abattus en sécurité, tronc découpé et déchets évacués. Devis gratuit au {TEL}.',
    'h1': 'Abattage d’arbres, même dangereux',
    'intro': 'Un arbre mort, malade, penché ou trop proche de la maison peut devenir un vrai danger. Le Ch’ti Élagueur abat vos arbres en toute sécurité, y compris les arbres dangereux, et laisse la place nette : tronc découpé, branches ramassées, déchets évacués.',
    'flow': flow([
        ('Quand faut-il abattre un arbre ?', 'Quand il est mort, malade, fendu, déstabilisé par une tempête ou trop penché, ou quand il menace un bâtiment, une clôture ou la voie publique. Abattre est parfois la seule solution sûre : nous vous le disons franchement, après avoir vu l’arbre.'),
        ('Les arbres dangereux, ça nous connaît', 'Près d’une maison, d’un garage, d’une ligne ou dans un petit jardin, on ne peut pas faire tomber un arbre d’un seul bloc. Il est alors démonté par morceaux, du haut vers le bas, pour que rien ne tombe là où il ne faut pas.'),
        ('La sécurité avant tout', 'La zone de travail est balisée, le matériel adapté à chaque arbre et chaque coupe préparée. Vous n’avez rien à faire : nous gérons l’intervention du début à la fin.'),
        ('Et après l’abattage ?', 'Le tronc est découpé, les branches ramassées et les déchets verts évacués. Si vous le souhaitez, nous retirons aussi la souche pour libérer complètement le terrain.'),
        devis('l’arbre à abattre'),
    ]),
}
SRC['taille-de-haies'] = {
    'title': 'Taille de haies à prix modérés — Le Ch’ti Élagueur, Lambersart',
    'description': f'Taille de haies à prix modérés à Lambersart et dans {ZONE} : thuyas, lauriers, charmilles, haies hautes ou en bordure de rue. Déchets évacués. Devis gratuit au {TEL}.',
    'h1': 'Taille de haies à prix modérés',
    'intro': 'Une haie bien taillée change tout l’aspect d’un jardin. Le Ch’ti Élagueur taille vos haies à prix modérés, nettes et droites, des petites bordures aux grandes haies de thuyas, et repart avec tous les déchets de coupe.',
    'flow': flow([
        ('Toutes les haies, toutes les hauteurs', 'Thuyas, lauriers, charmilles, troènes, photinias, haies champêtres : nous taillons les côtés et le dessus, même sur les grandes hauteurs. Une haie devenue trop haute ou trop large peut aussi être ramenée à de bonnes dimensions.'),
        ('Des prix modérés, un travail soigné', 'Le prix dépend de la longueur, de la hauteur et de l’accès à la haie, mais il reste raisonnable. Vous recevez un devis clair avant toute intervention, sans mauvaise surprise.'),
        ('Quand tailler sa haie ?', 'La taille d’entretien se fait en général une à deux fois par an, à la fin de l’hiver puis à la fin de l’été. On évite les grosses tailles du printemps au milieu de l’été, quand les oiseaux nichent dans les haies.'),
        ('Les haies en bordure de rue', 'En bordure de voie publique, la haie doit être taillée à l’aplomb de la limite de propriété : rien ne doit dépasser sur le trottoir. Nous remettons votre haie en règle, proprement.'),
        ('Les déchets ? On s’en occupe', f'Toutes les coupes sont ramassées et évacuées. Votre jardin et votre trottoir restent propres. Devis gratuit au {TEL} ou avec le formulaire.'),
    ]),
}
SRC['taille-arbres'] = {
    'title': 'Taille d’arbres d’ornement et fruitiers — Le Ch’ti Élagueur, Lambersart',
    'description': f'Taille d’arbres à Lambersart et dans {ZONE} : arbres d’ornement, arbres fruitiers, entretien régulier et mise en forme. Devis gratuit au {TEL}.',
    'h1': 'Taille d’arbres d’ornement et fruitiers',
    'intro': 'Une taille régulière garde vos arbres en bonne santé et à la bonne dimension pour votre jardin. Le Ch’ti Élagueur taille vos arbres d’ornement et vos arbres fruitiers, avec des coupes adaptées à chaque espèce.',
    'flow': flow([
        ('Taille d’entretien ou élagage ?', 'La taille d’entretien se fait régulièrement, sur des branches de petit diamètre, pour garder une belle forme. L’élagage concerne plutôt les grosses branches et les grands arbres. Nous faisons les deux, et nous vous conseillons ce qui convient à votre arbre.'),
        ('Arbres fruitiers : plus de fruits, moins de bois mort', 'Pommiers, poiriers, cerisiers, pruniers : une taille raisonnée aère le centre de l’arbre, retire le bois mort et favorise une récolte plus régulière.'),
        ('Arbres d’ornement', 'Érables, bouleaux, magnolias, saules : nous respectons la silhouette naturelle de l’arbre, ou la forme que vous souhaitez lui donner.'),
        ('La bonne période', 'La plupart des arbres se taillent pendant leur repos, en fin d’automne et en hiver. Certains, comme les cerisiers, préfèrent une taille après la récolte. Nous adaptons le calendrier à chaque arbre.'),
        devis('vos arbres'),
    ]),
}
SRC['dessouchage'] = {
    'title': 'Dessouchage à Lambersart — Le Ch’ti Élagueur',
    'description': f'Dessouchage d’arbres et de haies à Lambersart et dans {ZONE} : souches retirées, terrain dégagé et prêt à être réutilisé. Devis gratuit au {TEL}.',
    'h1': 'Dessouchage d’arbres et de haies',
    'intro': 'Après un abattage, la souche reste dans le sol : elle gêne la tonte, abîme la pelouse et peut repartir en rejets. Le Ch’ti Élagueur retire les souches d’arbres et de haies pour vous rendre un terrain dégagé.',
    'flow': flow([
        ('Pourquoi retirer une souche ?', 'Une souche prend de la place, attire parfois champignons et insectes, et empêche de replanter ou d’aménager à cet endroit. La retirer, c’est récupérer toute la surface de votre jardin.'),
        ('Souches d’arbres et anciennes haies', 'Une grosse souche isolée ou toute une rangée de vieilles souches de haie : nous adaptons la méthode au diamètre, aux racines et à l’accès au terrain.'),
        ('Un terrain prêt à l’emploi', 'Une fois la souche retirée, le trou est rebouché et les résidus sont évacués. Le terrain est libre pour ce que vous voulez en faire.'),
        ('Abattage et dessouchage en une seule fois', 'Si l’arbre est encore debout, nous pouvons l’abattre puis retirer la souche dans la foulée : un seul interlocuteur, un seul chantier.'),
        devis('les souches à retirer'),
    ]),
}
SRC['entretien-jardins'] = {
    'title': 'Entretien de jardins et d’espaces verts — Le Ch’ti Élagueur, Lambersart',
    'description': f'Entretien de jardins et d’espaces verts à Lambersart et dans {ZONE} : remise en état, taille, tonte, ramassage des feuilles, déchets évacués. Devis gratuit au {TEL}.',
    'h1': 'Entretien de jardins et d’espaces verts',
    'intro': 'Vous manquez de temps ou votre jardin vous dépasse ? Le Ch’ti Élagueur entretient votre jardin ou vos espaces verts, de façon ponctuelle ou régulière, pour qu’ils restent propres et agréables toute l’année.',
    'flow': flow([
        ('Un jardin propre toute l’année', 'Taille des haies et des arbustes, tonte, désherbage, ramassage des feuilles : nous faisons le nécessaire selon la saison et l’état de votre jardin.'),
        ('Remise en état ou suivi régulier', 'Pour un jardin laissé à l’abandon, nous commençons par une remise en état complète. Ensuite, un passage régulier suffit à le garder net.'),
        ('Jardins et espaces verts', 'Jardin de maison, cour, abords d’une résidence ou d’un local : nous intervenons sur les petites comme sur les grandes surfaces.'),
        ('Les déchets verts évacués', 'Tailles, tontes et feuilles sont ramassées et évacuées. Vous n’avez rien à porter à la déchetterie.'),
        devis('votre jardin'),
    ]),
}
SRC['evacuation-dechets-verts'] = {
    'title': 'Évacuation des déchets verts — Le Ch’ti Élagueur, Lambersart',
    'description': f'Évacuation des déchets verts à Lambersart et dans {ZONE} : branches, troncs, tailles de haie et feuilles ramassés et emportés. Devis gratuit au {TEL}.',
    'h1': 'Évacuation des déchets verts',
    'intro': 'Après un élagage, un abattage ou une grosse taille, il reste des branches, des troncs et des tas de feuilles. Le Ch’ti Élagueur ramasse et évacue vos déchets verts : vous n’avez rien à faire.',
    'flow': flow([
        ('Prévue dans nos chantiers', 'Sur nos chantiers d’élagage, d’abattage, de taille et de dessouchage, l’évacuation des déchets verts est prévue dès le devis. Le chantier vous est rendu propre.'),
        ('Aussi pour vos propres déchets', 'Vous avez taillé vous-même, ou un arbre est tombé chez vous ? Nous pouvons aussi passer uniquement pour enlever vos branches, vos troncs et vos déchets de jardin.'),
        ('Branches, troncs, haies, feuilles', 'Nous emportons ce qui vient du jardin : branches et troncs découpés, résidus de taille de haie, souches, feuilles et tontes.'),
        ('Ni déchetterie, ni remorque', 'Plus besoin d’allers-retours avec la voiture ni de remorque à louer : nous chargeons et nous emportons.'),
        devis('les déchets à évacuer'),
    ]),
}

# --------------------------------------------------------------------------- accueil
SRC['accueil'] = {
    'intro': 'Le Ch’ti Élagueur s’occupe de vos arbres et de votre jardin à Lambersart et dans tout le Nord et le Pas-de-Calais : élagage, abattage d’arbres même dangereux, taille de haies à prix modérés, taille d’arbres, dessouchage, entretien de jardins et d’espaces verts. À la fin de chaque chantier, les déchets verts sont évacués.',
    'flow': flow([
        ('Le devis est-il gratuit ?', f'Oui. Appelez le {TEL} ou remplissez le formulaire : nous venons voir vos arbres ou votre haie, puis nous vous remettons un devis clair, gratuit et sans engagement.'),
        ('Où intervenez-vous ?', 'Nous sommes basés à Lambersart et nous nous déplaçons dans tout le Nord (59) et le Pas-de-Calais (62) : Lille, Lomme, Saint-André-lez-Lille, La Madeleine, Marcq-en-Barœul, Wambrechies, Pérenchies et bien d’autres communes.'),
        ('Que faites-vous des branches et des déchets ?', 'Nous les ramassons et nous les évacuons : branches, troncs, tailles de haie, souches et feuilles. Vous n’avez rien à porter à la déchetterie.'),
        ('Pouvez-vous abattre un arbre dangereux près de la maison ?', 'Oui. Quand l’arbre ne peut pas tomber d’un seul bloc, il est démonté par morceaux, du haut vers le bas, pour protéger la maison, la clôture et les plantations.'),
        ('Quand tailler une haie ou élaguer un arbre ?', 'Les haies se taillent en général à la fin de l’hiver et à la fin de l’été, en évitant la période où les oiseaux nichent. La plupart des arbres s’élaguent pendant leur repos, de la fin de l’automne à la fin de l’hiver. Une branche morte ou dangereuse, elle, se retire à tout moment.'),
    ]),
}
SRC['realisations'] = {'description': 'Les chantiers du Ch’ti Élagueur en images : élagage, abattage, taille de haies et dessouchage, à Lambersart et dans tout le Nord et le Pas-de-Calais.'}

# --------------------------------------------------------------------------- villes (autour de Lambersart)
VILLES = [
    ('Lille', '59000', 'elagueur-a-lille-59000'),
    ('Lomme', '59160', 'elagueur-a-lomme-59160'),
    ('Saint-André-lez-Lille', '59350', 'elagueur-a-saint-andre-lez-lille-59350'),
    ('La Madeleine', '59110', 'elagueur-a-la-madeleine-59110'),
    ('Marcq-en-Barœul', '59700', 'elagueur-a-marcq-en-baroeul-59700'),
    ('Wambrechies', '59118', 'elagueur-a-wambrechies-59118'),
    ('Pérenchies', '59840', 'elagueur-a-perenchies-59840'),
]

# Plusieurs tournures par section, choisies selon la ville, pour que chaque page ait son propre texte
INTROS = [
    'Vous habitez {v} et vos arbres ou votre haie ont besoin d’un sérieux coup de propre ? Basé à Lambersart, tout près, le Ch’ti Élagueur intervient chez vous pour l’élagage, l’abattage, la taille de haies, le dessouchage et l’entretien du jardin, avec évacuation des déchets verts.',
    'À {v}, le Ch’ti Élagueur prend soin de vos arbres et de votre jardin : élagage, abattage même des arbres dangereux, taille de haies à prix modérés, dessouchage et entretien. Nous venons de Lambersart, à quelques minutes, et nous repartons avec tous les déchets verts.',
    'Un arbre trop grand, une haie qui déborde, une souche qui gêne ? Le Ch’ti Élagueur, basé à Lambersart, se déplace à {v} pour tous vos travaux d’arbres et de jardin. Le chantier vous est rendu propre, déchets verts évacués.',
]
S0 = [
    ('Élagage et abattage à {v}', 'Branches mortes, ramure trop dense, arbre penché ou dangereux : nous élaguons ou nous abattons selon l’état de l’arbre, en toute sécurité. Près d’une maison, l’arbre est démonté par morceaux pour ne rien abîmer.'),
    ('Vos arbres entre de bonnes mains à {v}', 'Nous élaguons pour garder un arbre sain et bien dessiné, et nous abattons quand il devient dangereux. Chaque coupe est préparée, et rien ne tombe là où il ne faut pas.'),
    ('Élagage, taille et abattage d’arbres', 'Qu’il s’agisse d’alléger un arbre, de le réduire ou de l’abattre, nous choisissons la solution la plus sûre pour votre jardin à {v}, et nous vous l’expliquons avant d’intervenir.'),
]
S1 = [
    ('Taille de haies à prix modérés', 'Thuyas, lauriers, charmilles, haies hautes ou en bordure de rue : nous taillons vos haies nettes et droites, à prix modérés, et nous ramassons toutes les coupes.'),
    ('Des haies nettes à {v}', 'Une haie bien taillée embellit tout le jardin. Nous taillons côtés et dessus, même sur les grandes hauteurs, à prix modérés, et nous laissons le trottoir propre.'),
    ('Haies taillées, trottoir propre', 'À {v} comme ailleurs, une haie en bordure de rue doit être taillée à l’aplomb de la propriété. Nous la remettons en règle à prix modérés, déchets compris.'),
]
S2 = [
    ('Dessouchage et entretien de jardin', 'Nous retirons les souches qui gênent, et nous entretenons votre jardin ou vos espaces verts, ponctuellement ou toute l’année : taille, tonte, ramassage des feuilles.'),
    ('Souches retirées, jardin entretenu', 'Après un abattage, la souche peut être retirée dans la foulée. Et pour un jardin qui vous dépasse, nous assurons une remise en état puis un entretien régulier.'),
    ('Un jardin entretenu toute l’année', 'Remise en état d’un jardin laissé à l’abandon, entretien régulier, dessouchage : nous adaptons nos passages à votre jardin et à la saison.'),
]
S3 = [
    ('Un chantier rendu propre', 'Branches, troncs, tailles de haie et feuilles : à la fin de chaque intervention, nous ramassons et nous évacuons les déchets verts. Vous n’avez rien à porter à la déchetterie.'),
    ('Les déchets verts, on les emporte', 'Pas de tas de branches au fond du jardin ni d’allers-retours à la déchetterie : l’évacuation des déchets verts est prévue dès le devis.'),
    ('Rien ne reste derrière nous', 'Nous laissons votre jardin net : coupes ramassées, troncs découpés, déchets verts évacués le jour même.'),
]
S4 = [
    ('Un devis gratuit à {v}', f'Appelez le {TEL} ou remplissez le formulaire : nous venons voir vos arbres ou votre haie à {{v}} et nous vous remettons un devis clair, gratuit et sans engagement.'),
    ('Parlons de votre projet', f'Un arbre à élaguer, une haie à tailler, une souche à retirer à {{v}} ? Le devis est gratuit et sans engagement : appelez le {TEL} ou écrivez-nous avec le formulaire.'),
    ('Votre devis, sans engagement', f'Nous passons voir le chantier à {{v}} et nous vous remettons un devis gratuit. Joignez-nous au {TEL} ou avec le formulaire ci-dessous.'),
]


def ville_contenu(i, ville, cp):
    def f(paire):
        return [paire[0].replace('{v}', ville), paire[1].replace('{v}', ville)]
    secs = [f(S0[i % 3]), f(S1[(i + 1) % 3]), f(S2[(i + 2) % 3]), f(S3[i % 3]), f(S4[(i + 1) % 3])]
    return {
        'title': f'Élagueur à {ville} ({cp}) — Le Ch’ti Élagueur',
        'description': f'Élagage, abattage d’arbres, taille de haies et dessouchage à {ville} ({cp}). Le Ch’ti Élagueur, basé à Lambersart, se déplace chez vous. Devis gratuit au {TEL}.',
        'h1': f'Votre élagueur à {ville}',
        'intro': INTROS[i % 3].replace('{v}', ville),
        'flow': flow(secs),
    }


for _i, (_v, _cp, _slug) in enumerate(VILLES):
    SRC[_slug] = ville_contenu(_i, _v, _cp)
