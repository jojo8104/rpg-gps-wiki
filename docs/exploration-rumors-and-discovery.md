# Rumeurs, prospection et spécialistes transportés

Depuis le 1er novembre 2026, les trésors, artefacts et donjons sont placés uniquement hors de l’influence des lieux normaux. Toute cellule touchant leur portée normale est exclue du placement exceptionnel. Le parcours est unique : cartes de localisation, recherche extérieure avec la jauge, puis expédition de récupération (cette dernière reste à implémenter). Les lieux normaux fournissent toujours des indices, des rumeurs et des repères cartographiques.

Les PNJ proposent des conversations donnant parfois un indice de localisation ou de recherche. La prospection et les spécialistes
transportés révèlent le terrain au joueur concerné, sans créer d’exploitation.
Ces règles sont disponibles côté serveur en GPS comme sur carte fictive.

| Action | Conditions et effet |
| --- | --- |
| Écouter une rumeur | Gratuit ; 25 % de conversation utile si le stock local le permet ; cadeau, vente à 5 or après accord ou embranchement |
| Relire une information | Document acquis consultable sans consommation ; anciens renseignements conservés |
| Prospection | Expédition existante du poste de prospection ; révèle les gisements traversés et les sites exceptionnels extérieurs actifs |
| Géologue transporté | Pierre, fer et or : 50 % par cellule et spécialité |
| Mineur transporté | Fer et or : 50 % |
| Bûcheron transporté | Bois : 50 % |
| Fermier transporté | Terre fertile : 50 % |
| Cartographe ou explorateur transporté | Chaque ressource naturelle : 20 % |

Le barème des spécialistes est le réglage configurable retenu, pas une
probabilité de génération des ressources. Les répartitions du terrain restent
inchangées. Sur les nouvelles cartes à blocs, une spécialité tente une découverte une seule fois par joueur et bloc, y compris depuis une case périphérique. Sur les anciens terrains, la limite reste par cellule. Un deuxième exemplaire du même spécialiste ne multiplie pas les essais.

## Conversations et rumeurs

Les tavernes ne proposent plus de catalogue de cartes ni d’explications des cartes détenues. Une seule entrée « Écouter une rumeur » ouvre une conversation à la fois. L’écoute est gratuite : elle peut rester sans intérêt ou donner un indice de localisation ou de recherche. Le réglage initial conserve 25 % de chances de conversation utile si le stock local le permet. Le renseignement peut être offert, vendu pour 5 or après acceptation, ou confié à l’issue d’un choix de dialogue. Les chefs et les forgerons utilisent le même mécanisme. Une proposition en cours est conservée après fermeture et reprise : consulter les choix ne relance aucun tirage. Les stocks sont finis et les indices fiables, sans fausse destination. Les documents ne prennent aucune place de bagage.

Les quêtes et scénarios peuvent aussi remettre un indice avec une récompense explicitement configurée. Voir [Rumeurs, conversations et documents](tavern-rumors-and-documents.md).

## Prospection sans exploitation automatique

Le poste conserve ses règles de préparation, sa spirale, ses coûts, son retour
et ses personnels. Pendant l’exploration, le serveur examine les segments
réellement parcourus. Il révèle les cellules contenant une ressource, sauf
celles neutralisées par l’influence enregistrée d’un lieu.

Les trésors, artefacts et donjons extérieurs actifs sont également repérables
par la prospection. Aucun site n’est généré dans les lieux normaux ou sous leur influence.
Le retour d’une expédition n’effectue pas une seconde exploration.

La découverte ajoute une connaissance individuelle. Elle ne crée ni mine,
carrière, village ou camp de bûcherons ; elle ne crée aucune production et
ne donne aucun équipement. Les gisements historiques `ResourceZone` restent
lisibles dans les sauvegardes et peuvent être signalés, mais leur découverte
ne crée plus de lieu producteur. Un lieu déjà installé dans une ancienne partie
n’est pas supprimé rétroactivement.

## Découverte lors d’un déplacement du héros

Le spécialiste doit être effectivement transporté dans les bagages ou les
ressources du héros : il faut au moins un individu entier. Un spécialiste laissé
dans un stock distant ne participe pas. Le serveur applique la chance du métier
sur les cellules traversées entre deux positions. Les généralistes ont une chance
plus faible sur toutes les ressources naturelles. Un métier sans correspondance
avec la ressource ne déclenche aucun tirage.

Un échec est mémorisé pour ce joueur, cette cellule et cette spécialité.
Rester immobile, refaire le passage, changer de héros du même joueur ou recharger
la partie ne relance pas cet essai. Un autre métier pertinent peut tenter son
propre essai. Dès que la ressource est connue, aucun essai supplémentaire n’est
nécessaire. Le nombre de spécialistes d’un même métier n’augmente pas la chance.

En GPS, une précision supérieure à 50 mètres ou un saut supérieur à 250 mètres
entre mesures n’ouvre pas d’essai. La simulation utilise les mêmes ressources,
spécialités et tirages ; seules les mesures et distances diffèrent. Les tirages
et les essais restent privés et sont conservés dans la sauvegarde serveur.

Les spécialistes transportés révèlent ici les ressources naturelles. La recherche
active et les interactions des sites exceptionnels font partie des étapes
suivantes. Une révélation ne clôture pas un site et ne distribue pas sa récompense.

## Messages et confidentialité

Le journal affiche les gisements désormais connus et les explications apprises.
Chaque joueur reçoit uniquement ses cellules, ses sites et ses rumeurs autorisés.
Une alliance ne partage pas automatiquement ces connaissances. Les options et
les commandes utilisent des identifiants opaques, sans coordonnées cachées.
Le navigateur ne choisit ni le tirage, ni le spécialiste effectivement transporté.

Les preuves de localisation, les essais ratés et les autres cellules restent
privés. La prospection n’attribue aucune ressource à exploiter immédiatement.
La fondation et l’évolution des camps, la jauge de recherche et les expéditions
de récupération restent à raccorder dans leurs étapes dédiées.

## Historique

28 octobre 2026 — explications cohérentes par les PNJ, rumeurs à 5 or,
connaissances persistantes, prospection sans producteur automatique et découvertes
par les spécialistes transportés. Les versions précédentes sont accessibles
dans l’historique daté de l’article du wiki.

28 octobre 2026 — chances augmentées à la demande du joueur : 50 % pour les métiers pertinents et 20 % pour les généralistes. Les essais déjà effectués ne sont pas relancés.

29 octobre 2026 — rumeurs payantes donnant un message de recherche ou une conversation sans importance ; explications de cartes gratuites et documents hors capacité des bagages.

30 octobre 2026 — la [recherche extérieure](exploration-search.md) est désormais disponible pour les trois types de sites exceptionnels. La récupération des récompenses reste à implémenter ; le parcours intérieur est abandonné.


1er novembre 2026 — suppression du placement exceptionnel dans les lieux normaux et sous leur influence ; parcours de recherche extérieur unique.


## Fondation et terrain — 1er novembre 2026

La [fondation des camps et leurs évolutions selon le terrain](camp-foundation-and-terrain.md) est disponible sur place ou par expédition depuis un poste de prospection. Les positions, coûts, disponibilités et évolutions sont validés par le serveur. La prospection révèle aussi les cases vides. Le camp conserve son gisement d’origine ; son influence neutralise les cellules voisines et ferme les sites exceptionnels encore actifs couverts, sans attribuer leur butin. Les lieux historiques conservent leurs règles. Les possibilités des nouveaux camps sont transmises comme état officiel, sans nouveau calcul de règles dans l’interface.
