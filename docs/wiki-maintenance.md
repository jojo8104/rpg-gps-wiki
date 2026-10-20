# Maintenir le wiki

Le wiki public commence dans `wiki/index.html`, un index de liens vers les articles.
Chaque article possède sa propre page HTML, consultable sans backend ni JavaScript.
Les anciennes ancres de l’index restent accessibles et conduisent à la fiche du lien
vers l’article, sans recopier tout son contenu dans l’accueil.

## Mise à jour

À chaque changement du jeu dans une discussion, mettre à jour le wiki en parallèle,
sauf indication contraire explicite de l’utilisateur. Pour les changements techniques,
expliquer leur effet ou leur absence d’effet sur les règles dans la rubrique concernée.

1. Modifier les textes dans `docs/wiki-content.json` pour refléter le changement.
2. Mettre à jour les documents de règles associés dans `docs/` et leur explication
   dans `docs/wiki-articles.json`. Chaque document lié possède une introduction,
   une analyse pratique, un statut éventuel et une liste d’illustrations. Les liens
   Markdown entre ces documents sont suivis pour créer leurs pages HTML.
3. Exécuter `npm run wiki:build -- --note "Description du changement"` : les classes et les unités sont reprises automatiquement des catalogues JSON du jeu.
4. Vérifier l’index et les articles dans un navigateur. Inclure les pages HTML,
   `wiki/build-manifest.json`, `wiki/history.json`, les nouveaux médias dans
   `wiki/media/` et les nouvelles archives de `wiki/archives/` dans le commit.

## Articles de référence et illustrations

Les liens de lecture vont vers des articles HTML, jamais vers le Markdown brut.
Le rendu prend en charge les titres, paragraphes, listes, citations, tableaux,
exemples de code et liens entre documents. Le texte de référence est présenté
après l’explication éditoriale : il permet de vérifier les règles sans remplacer
la synthèse. Les éléments prévus ou historiques doivent être signalés explicitement.

Dans `docs/wiki-articles.json`, `images[].path` est relatif à `app/assets/` et
`images[].caption` explique l’illustration. Choisir des assets existants en rapport
avec le sujet ; ne pas inventer de propriétés à partir d’une image. Une planche de
sprites est présentée comme une planche, et non comme un effectif de troupes.
Les catalogues utilisent les portraits et vignettes des classes et unités.

Le générateur copie les images dans `wiki/media/`, avec une empreinte de leur contenu
dans le nom. Si un asset change, son ancien fichier reste disponible pour les archives.
L’export emporte ces médias : les images du wiki dédié ne dépendent pas du serveur du jeu.

## Historique des articles

Chaque rubrique du guide, document de référence et catalogue constitue un article. Une note en fin
d’article affiche sa version, sa date et le changement effectué, puis les liens vers
ses versions précédentes. Les nouvelles archives conservent le contenu HTML de
l’article et les liens vers ses médias conservés. Les archives plus anciennes
gardent leur format original, avec le texte des documents à déplier ; elles ne sont
jamais réécrites lors d’un changement de présentation.

Le générateur compare le contenu de chaque article et de ses documents liés. Seuls
les articles modifiés obtiennent une nouvelle version. Une génération identique ne
crée pas d’archive supplémentaire. Une modification d’un article existant sans note
est refusée, y compris dans le workflow de publication : générer et committer les
archives avec une note avant de pousser le changement.

Ne jamais supprimer ni modifier une archive ou réinitialiser `wiki/history.json`.
Pour corriger une erreur, modifier l’article actuel et créer une nouvelle version.
L’historique commence avec la version initiale du wiki ; les changements du jeu
antérieurs à sa création ne sont pas reconstitués.

Ne pas modifier directement le HTML généré : la génération suivante l’écraserait.
Le style se modifie dans `wiki/wiki.css`. Les valeurs des catalogues sont des
valeurs de base, pas une simulation des bonus ou du résultat des actions.

## GitHub Pages

Le wiki dispose du dépôt public dédié `https://github.com/jojo8104/rpg-gps-wiki`
et de l’adresse `https://jojo8104.github.io/rpg-gps-wiki/`.
Les sources restent maintenues ici pour accompagner les changements du jeu.
Après génération avec une note, exécuter `npm run wiki:export` pour copier les
articles, archives, documents liés, catalogues et outils dans `.wiki-publish/`.
Ce dossier est ignoré par le dépôt du jeu. Il possède son propre dépôt Git :
y committer les changements et pousser `main` pour publier le wiki dédié.
L’export ne supprime aucun fichier ni aucune archive. Le site dédié utilise
GitHub Pages depuis la racine de `main`, sans workflow supplémentaire.

Le workflow existant `.github/workflows/pages.yml` génère le wiki avant de publier
le dépôt. Une fois le déploiement réussi, ajouter `wiki/` à l’URL GitHub Pages
du projet : `https://<compte>.github.io/<depot>/wiki/`.

En local, ouvrir `wiki/index.html` ou, après `npm start`, aller à
`http://localhost:3000/wiki/`. L’index, les articles, leurs références et les
catalogues sont affichés en HTML. `npm test` dans le dépôt dédié vérifie le rendu
et l’historique ; une génération sans note doit rester possible après l’export.

## Contenu fiable

Vérifier toute nouvelle explication contre les modules du moteur et leurs tests.
Une fonctionnalité prévue doit être annoncée comme telle et séparée des règles
disponibles. Lors d’un changement de règle, mettre à jour son explication dans
le même changement de code. La génération automatise les catalogues, pas la
rédaction des explications.
