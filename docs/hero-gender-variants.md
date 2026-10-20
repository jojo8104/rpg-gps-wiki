# Variantes visuelles des héros

Trois variantes sont préparées : une Guerrière, un Mage masculin et un Éclaireur masculin. Chaque variante possède un portrait illustré et une planche de quinze sprites sur fond transparent, dans le style des héros existants.

Les fichiers sont conservés séparément dans `app/assets/portraits/` et `app/assets/heroes/`, avec les identifiants `warrior-female`, `mage-male` et `ranger-male` et le suffixe `v1`. Les portraits portent le préfixe `hero-` et les planches le suffixe `jrpg-walk`.

Les planches présentent trois colonnes (immobile, pas gauche, pas droit) et cinq lignes (dos N, diagonale NE, profil E, diagonale SE, face S). Les vues ouest peuvent utiliser les miroirs des vues est comme les sprites actuels.

## Statut

Assets préparés et consultables dans `output/hero-variants/index.html`. La sélection de ces variantes en partie n’est pas encore raccordée. Les fichiers actuels et leur sélection par classe restent conservés. Ces visuels ne modifient aucune caractéristique, règle, action ou validation du serveur, en GPS comme sur carte fictive.

## Création

Visuels générés avec l’outil intégré imagegen à partir des portraits et planches existants comme références de style et de costume. Les prompts exacts sont conservés dans `output/hero-variants/prompts.json`.
