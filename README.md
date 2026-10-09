# Wiki RPG GPS

Wiki HTML : https://jojo8104.github.io/rpg-gps-wiki/

Ce dépôt contient le guide, les catalogues, les documents de règles et les versions
archivées. Aucun backend du jeu n’est inclus.

Les sources sont maintenues avec le jeu dans https://github.com/jojo8104/rpg-gps.
Après chaque changement, générer le wiki avec une note puis exécuter
`npm run wiki:export` dans le projet du jeu. Committer et pousser le résultat
du dossier `.wiki-publish/` sur ce dépôt. Ne jamais supprimer les archives.

Dans ce dépôt, `npm test` vérifie l’archivage et `npm run wiki:build` vérifie
la génération. Aucune dépendance npm n’est nécessaire.

GitHub Pages sert la branche `main` depuis la racine du dépôt.
