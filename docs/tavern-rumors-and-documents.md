# Rumeurs, conversations et documents

Les tavernes ne proposent plus de catalogue de cartes ni d’explications des cartes détenues. Une seule entrée « Écouter une rumeur » ouvre une conversation à la fois. L’écoute est gratuite : elle peut rester sans intérêt ou donner un indice de localisation ou de recherche. Le réglage initial conserve 25 % de chances de conversation utile si le stock local le permet. Le renseignement peut être offert, vendu pour 5 or après acceptation, ou confié à l’issue d’un choix de dialogue. Les chefs et les forgerons utilisent le même mécanisme. Une proposition en cours est conservée après fermeture et reprise : consulter les choix ne relance aucun tirage. Les stocks sont finis et les indices fiables, sans fausse destination. Les documents ne prennent aucune place de bagage.

| Interaction | Condition et résultat |
| --- | --- |
| Écouter | Gratuit ; héros présent, actif et disponible auprès d’un PNJ accessible |
| Conversation utile | 25 % si un indice du stock local est disponible |
| Cadeau | Remise gratuite d’un indice |
| Vente de renseignement | 5 or uniquement après acceptation ; refuser est gratuit |
| Discussion à embranchement | Écouter avec attention permet d’obtenir l’indice ; couper court ne donne rien |
| Localisation | Carte ou fragment donnant des indications de destination |
| Recherche / découverte | Document aidant à découvrir le site sur place, sans le localiser |
| Documents | Aucun emplacement de bagage, même lorsque les bagages sont pleins |

## Une conversation en cours

Après une écoute utile, le PNJ peut proposer une vente ou un récit à approfondir. Seuls les choix de cette conversation apparaissent à sa place ; il faut la terminer ou la décliner avant une autre écoute auprès de ce PNJ. Un indice proposé est réservé pendant la conversation. Un stock épuisé ne fabrique pas de nouveau document : la rumeur reste une conversation d’ambiance. Si le site a fermé entre-temps, aucun paiement ni indice utilisable n’est accordé.

Les textes d’un indice ne sont révélés qu’après sa remise. Une rumeur sans intérêt n’est pas un faux indice. Lire un document ne révèle pas automatiquement le site. Chaque indice garde son seul effet : localisation ou recherche. Les séries de cartes restent complémentaires.

## Quêtes et scénarios

Les auteurs peuvent configurer une remise d’indice à la fin d’une quête ou d’un embranchement avec l’effet serveur `grantExplorationClue`. Cette possibilité ne modifie pas automatiquement les récompenses de toutes les quêtes existantes. L’effet prélève un document réel du stock fini, vérifie le site et enregistre la remise pour éviter les doublons. S’il ne reste rien, aucun indice n’est créé.

## Sauvegardes et confidentialité

Les anciens documents, explications déjà apprises et résultats restent conservés ; les anciennes actions d’explication et d’achat direct en taverne sont refusées. Les nouvelles discussions et remises de récompenses sont sauvegardées. Rejouer une réponse déjà consommée ne donne ni second indice ni second débit. Le client reçoit seulement les choix autorisés et les documents acquis, sans le tirage ni l’identifiant du document réservé.

## Conservation des documents

Les cartes, fragments et messages restent consultables dans Documents. Ils peuvent être déposés, transférés, perdus, vendus et archivés selon leurs règles habituelles. Leur absence d’encombrement ne supprime pas les risques associés à la perte ou à la vente d’un indice actif.

2 novembre 2026 — suppression des explications et des achats directs en taverne ; rumeurs narratives, indices de localisation ou de recherche et récompenses configurables. Les anciennes versions restent accessibles dans l’historique du wiki.
