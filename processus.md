# Faire un monorepo

---

On veut faire un monorepo pour faciliter la mise en ligne de notre application.

Au lieu d'avoir un front et un back à mettre en ligne, on n'aura qu'un seul dépôt.

---

## Préparation

On doit commencer par 'bundler' (regrouper) nos fichiers JS en un seul fichier, dans l'objectif de gagner de la place, de la bande passante et donc de réduire le temps de chargement de l'application.

### Etapes pour fabriquer un bundle avec vite

1. faire un script dans `package.json` : `"build": "vite build"`
2. Faire `npm run build`

Après ces deux étapes, on obtient un répertoire `dist`, qui contient un fichier `index.html` ainsi que les fichiers `css` et `js`.

Ce sont ces fichiers que l'on va transférer dans l'API pour faire un monorepo.

Les fichiers `js` et `css` contiennent tout le code nécessaire au fonctionnement du front, et est compilé de manière à ce qu'il soit optimisé et lisible uniquement par les navigateurs.

Le fichier `index.html` référence correctement les fichiers `css` et `js` qui ont été produit par vite

### Etapes pour intégrer le bundle front dans l'API

1. On met le répertoire `dist/assets` à la racine du dépôt de l'API.
2. On met le fichier `dist/index.html` à la racine du dépôt de l'API, à côté du `index.js`.
3. On fait une route `/` pour qu'express nous serve le fichier `index.html`
4. On fait un middleware `express.static` pour qu'express sache ou aller chercher le `js` et le `css` du front
