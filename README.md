# O'kanban - SPA E03 - Révisions - CRUD sur les cartes

TODO Bonus **une idee a creuser! glisser une carte en dehors des listes = supprimer la carte**

Les fonctionnalités liées aux listes sont toutes implémentées. **C'est l'heure d'ajouter celles des cartes !**

Challenge de révisions (bonus) - Faites de votre mieux がんばって !

## Étape 1 - READ - Afficher les cartes

Profiter de la réponse API du `GET /lists` qui retourne d'ores et déjà les listes **avec leurs cartes** pour afficher également les cartes à l'intérieur de la liste appropriée.

> Pssst, il faudra très certainement créer une fonction `insertCardInList(card)` pour gérer l'affichage d'une carte dans sa liste de prédilection (`card.list_id`)

En bonus, on peut afficher la couleur de la carte en lui ajoutant une `border`.

## Étape 2 - CREATE - Ajout d'une carte

Faire fonctionner le bouton `➕` afin qu'il ouvre une nouvelle fenêtre de dialogue d'ajout de carte.

On pourra stocker dans le `dataset` de cette fenêtre de dialogue l'ID de la liste dans laquelle ajouter la future carte.

Faire fonctionner le formulaire, appeler la bonne route puis afficher la carte créée dans la liste appropriée.

En bonus, on permet à l'utilisateur de choisir la couleur de la carte.

## Étape 3 - UPDATE - Modification d'une carte

Faire fonctionner le bouton `🖍️` afin qu'il ouvre une nouvelle fenêtre de dialogue d'édition de carte et faire fonctionner cette fenêtre de dialogue

Suite à l'appel API, on modifie l'apparence de la carte en conséquence.

En bonus, on permet à l'utilisateur de modifier également la couleur de la carte.

## Étape 4 - DELETE - Suppression d'une carte

Faire fonctionner le bouton `🗑️` afin qu'il ouvre une fenêtre de dialogue de confirmation de suppression et faire fonctionner cette fenêtre de dialogue.

## Étape 5 - Drag & Drop - Déplacer une carte

Ajouter la possibilité de déplacer une carte :

- au sein de la même liste : on applique le même principe que pour les listes en récupérant l'ID et la position de chaque liste que l'on met à jour via l'API.
- entre deux listes : il est possible de déplacer une carte d'une liste à l'autre ; dans ce cas, il faudrait aussi _update_ la `list_id` de la carte que l'on déplace.

## O'kanban - SPA E03 - CRUD & Drag & Drop

[Rappel : lien pour créer des issues](https://github.com/O-clock-Skaven/Soutien-ateliers/issues)

## Étape 1 - On relance les serveurs

On rappelle à toute fin utile qu'il faut lancer le frontend ET le backend indépendamment pour que les deux puissent communiquer 🗣️.

## Étape 2 - Modifier une liste

### 2.1. Créer une fenêtre de dialogue d'édition de liste

Dans le HTML, s'inspirer de la fenêtre de dialogue d'ajout de liste existante et créer une nouvelle fenêtre de dialogue pour l'édition du titre d'une liste.

> **ASTUCE** l'afficher avec la classe `is-active` (codée en dur) pour la tester, puis retirer cette classe que l'on ajoutera dynamiquement suite à une interaction de l'utilisateur.

### 2.2. Créer le bouton d'édition

Dans le HTML, modifier le template d'une liste pour ajouter une icône « crayon » 🖍️ à l'aide de la librairie `Font Awesome` déjà en place (V6).

On peut s'inspirer du code existant pour le bouton « plus » ➕.

### 2.3. Ouvrir la fenêtre de dialogue

Lors d'un clic sur ce bouton, depuis n'importe quelle liste, on souhaite ouvrir la fenêtre de dialogue d'édition. Pour cela, il faut poser un _listener_ sur ce bouton.

**Problème** : à l'ouverture de la page par l'utilisateur, les listes ne sont pas encore présentes dans le DOM, puisque le frontend doit les `fetch` au préalable.

**Solution** : on doit poser le _listener_ directement sur le clone avant son insertion dans le DOM, c'est-à-dire dans la fonction `addListToListsContainer`.

<details><summary>Un peu d'aide ?</summary>

```js
function addListToListsContainer(listData) {
  // ...

  const editListButton = listClone.querySelector(/* SÉLECTEUR pour le bouton 🖍️ situé dans le clone */);
  editListButton.addEventListener("click", () => {
    // Ouvrir la fenêtre de dialogue d'édition de liste
  });
}
```

</details>

**Problème** : une fois la fenêtre de dialogue ouverte, impossible de savoir via quelle liste celle-ci a été ouverte !

**Solution** : on pourrait ajouter dans les [dataset](https://developer.mozilla.org/fr/docs/Learn/HTML/Howto/Use_data_attributes) de la fenêtre de dialogue d'édition, l'ID de la liste sur laquelle l'utilisateur vient de cliquer.

<details><summary>Un peu d'aide ?</summary>

```js
function addListToListsContainer(listData) {
  // ...

  const editListButton = listClone.querySelector(/* SÉLECTEUR pour le bouton 🖍️ situé dans le clone */);
  editListButton.addEventListener("click", () => {
    // Ouvrir la fenêtre de dialogue d'édition de liste

    const editListModal = document.querySelector(/* SÉLECTEUR pour la fenêtre de dialogue d'édition */);
    editListModal.dataset.listId = listData.id;
  });
}
```

> **Note :** vous pouvez utiliser l'inspecteur (onglet `Inspecteur` ou `Element`) pour constater le résultat :
> lorsque vous ouvrez la fenêtre de dialogue, celle-ci présente dans son HTML l'attribut `data-list-id="X"` où `X` est l'ID de la liste choisie.

</details>

### 2.4. Soumission du formulaire

De manière similaire au formulaire d'ajout d'une liste :

- écouter la soumission du formulaire de modification d'une liste ;
- récupérer les données du formulaire ;
- faire une requête `PATCH` vers la route `/lists/:id` ;
  > l'ID de la liste à modifier se trouve dans les `dataset` de la fenêtre de dialogue, comme vu à l'étape précédente !
- récupérer le résultat de la requête ;
- mettre à jour la liste sur la page, avec son nouveau titre ;
- fermer la fenêtre de dialogue ;
- re-initialiser le formulaire.

<details><summary>Un peu d'aide ?</summary>

```js
// Sélectionner le formulaire d'édition de liste
//
// Écouter l'évènement `submit` sur ce formulaire, auquel cas :
// - empêcher le comportement par défaut du formulaire
// - récupérer les données du formulaire (le nouveau titre)
// - récupérer l'ID de la liste à modifier dans les dataset de la fenêtre de dialogue
// - PATCH `/lists/:listId` avec comme body { "title": "..." }
// - récupérer le résultat de la requête PATCH, et en cas de succès
// - sélectionner la liste du DOM correspondant au bon ID
// - modifier le contenu de l'élément avec le slot `list-title` avec le nouveau titre choisi
// - fermer la fenêtre de dialogue
// - reset le formulaire
//
// Festoyer !
```

</details>

---

⚠️ **Les deux parties suivantes sont indépendantes.** ⚠️

---

## Étape 3 (BONUS) - Suppression d'une liste

Bon bah, rebelote, hein 🤪 !

Cette fois-ci, un peu plus débrouillard :

- ajouter un bouton de suppression sur les listes ;
- ouvrir une fenêtre de dialogue de « confirmation avant suppression » ;
    > **BONUS** si la liste possède des cartes :
    > - prévenir que la suppression supprimera également toutes les cartes à l'intérieur ;
    > - OU empêcher explicitement l'utilisateur de supprimer une liste qui possède des cartes.

- suite à la confirmation de la suppression, faire une requête `DELETE` vers l'API pour supprimer la liste ;
- retirer la liste de la page ;
- fermer la fenêtre de dialogue.

## Étape 4 (BONUS) - Drag & Drop

On souhaiterait pouvoir modifier la **position** des listes sur le Kanban, en glissant-déposant une liste vers un nouvel emplacement.

**Problème :** _on va quand même pas le faire à la main 🙀 ?_

**Solution :** _et bah non !_ Il existe des solutions clé-en-main pour la partie frontend.

## 4.1. Installation

Jeter un œil à la [documentation](https://github.com/SortableJS/Sortable) de `SortableJS`,
aux [démonstrations](http://sortablejs.github.io/Sortable/),
et l'installer dans le code en utilisant le script fourni via un [CDN](https://github.com/SortableJS/Sortable?tab=readme-ov-file#cdn).

> **NOTE** ce script externe doit être chargé AVANT nos scripts, sinon il ne sera pas possible d'utiliser la variable globale `Sortable`.

## 4.2. Mise en place (frontend)

Objectif n°1 : réussir à logger en `console` l'ID de la liste qui vient d'être déplacé.

<details><summary>Un peu d'aide ?</summary>

```js
Sortable.create(ELEMENT_DU_DOM_CONTENANT_LISTES, {
  onEnd(event) {
    // Callback qui se déclenche lorsque l'utilisateur déplace une liste
    console.log(event);
  }
});
```

</details>

## 4.3. Mise à jour (backend)

Objectif n°2 : réussir à sauvegarder la position actuelle de toutes les listes.

Pour **chaque** liste sur la page, récupérer sa position et exécuter une requête `PATCH /lists/:listId` (avec le bon body) afin de sauvegarder sa nouvelle position.

> **NOTE** cette approche n'est absolument pas performante, car on lance **une requête HTTP par liste**,
> ce qui peut faire beaucoup selon le nombre de listes présentes sur la page !
> Idéalement, on aimerait uniquement mettre à jour la liste qui vient d'être déplacé. Nous discuterons en cours d'autres implémentations et modélisations possibles.

<details><summary>Un peu d'aide</summary>

```js
// Dans le callback 'onEnd'

// Sélectionner toutes les listes sur la page
// Pour chaque liste :
// - récupérer son ID
// - récupérer sa position
// - faire l'appel PATCH /lists/:listId avec BODY { position: X }

```

</details>

## O'kanban - SPA E02 - Fetch et templates

[Rappel : lien pour créer des issues](https://github.com/O-clock-Skaven/Soutien-ateliers/issues)

⚠️ **Le retour du front !** Pensez à `console.log` après chaque ligne pour tester régulièrement ⚠️

⚠️ `Commit` entre chaque étape ! On ne le dira jamais assez 🤪

## Étape 1 - Mise en place

### 1.1. Lancer le back 🦿# O'kanban - SPA E03 - CRUD & Drag & Drop

[Rappel : lien pour créer des issues](https://github.com/O-clock-Quindim/Soutien-ateliers/issues)

## Étape 1 - On relance les serveurs

On rappelle à toute fin utile qu'il faut lancer le frontend ET le backend indépendamment pour que les deux puissent communiquer 🗣️.

## Étape 2 - Modifier une liste

### 2.1. Créer une fenêtre de dialogue d'édition de liste

Dans le HTML, s'inspirer de la fenêtre de dialogue d'ajout de liste existante et créer une nouvelle fenêtre de dialogue pour l'édition du titre d'une liste.

> **ASTUCE** l'afficher avec la classe `is-active` (codée en dur) pour la tester, puis retirer cette classe que l'on ajoutera dynamiquement suite à une interaction de l'utilisateur.

### 2.2. Créer le bouton d'édition

Dans le HTML, modifier le template d'une liste pour ajouter une icône « crayon » 🖍️ à l'aide de la librairie `Font Awesome` déjà en place (V6).

On peut s'inspirer du code existant pour le bouton « plus » ➕.

### 2.3. Ouvrir la fenêtre de dialogue

Lors d'un clic sur ce bouton, depuis n'importe quelle liste, on souhaite ouvrir la fenêtre de dialogue d'édition. Pour cela, il faut poser un _listener_ sur ce bouton.

**Problème** : à l'ouverture de la page par l'utilisateur, les listes ne sont pas encore présentes dans le DOM, puisque le frontend doit les `fetch` au préalable.

**Solution** : on doit poser le _listener_ directement sur le clone avant son insertion dans le DOM, c'est-à-dire dans la fonction `addListToListsContainer`.

<details><summary>Un peu d'aide ?</summary>

```js
function addListToListsContainer(listData) {
  // ...

  const editListButton = listClone.querySelector(/* SÉLECTEUR pour le bouton 🖍️ situé dans le clone */);
  editListButton.addEventListener("click", () => {
    // Ouvrir la fenêtre de dialogue d'édition de liste
  });
}
```

</details>

**Problème** : une fois la fenêtre de dialogue ouverte, impossible de savoir via quelle liste celle-ci a été ouverte !

**Solution** : on pourrait ajouter dans les [dataset](https://developer.mozilla.org/fr/docs/Learn/HTML/Howto/Use_data_attributes) de la fenêtre de dialogue d'édition, l'ID de la liste sur laquelle l'utilisateur vient de cliquer.

<details><summary>Un peu d'aide ?</summary>

```js
function addListToListsContainer(listData) {
  // ...

  const editListButton = listClone.querySelector(/* SÉLECTEUR pour le bouton 🖍️ situé dans le clone */);
  editListButton.addEventListener("click", () => {
    // Ouvrir la fenêtre de dialogue d'édition de liste

    const editListModal = document.querySelector(/* SÉLECTEUR pour la fenêtre de dialogue d'édition */);
    editListModal.dataset.listId = listData.id;
  });
}
```

> **Note :** vous pouvez utiliser l'inspecteur (onglet `Inspecteur` ou `Element`) pour constater le résultat :
> lorsque vous ouvrez la fenêtre de dialogue, celle-ci présente dans son HTML l'attribut `data-list-id="X"` où `X` est l'ID de la liste choisie.

</details>

### 2.4. Soumission du formulaire

De manière similaire au formulaire d'ajout d'une liste :

- écouter la soumission du formulaire de modification d'une liste ;
- récupérer les données du formulaire ;
- faire une requête `PATCH` vers la route `/lists/:id` ;
  > l'ID de la liste à modifier se trouve dans les `dataset` de la fenêtre de dialogue, comme vu à l'étape précédente !
- récupérer le résultat de la requête ;
- mettre à jour la liste sur la page, avec son nouveau titre ;
- fermer la fenêtre de dialogue ;
- re-initialiser le formulaire.

<details><summary>Un peu d'aide ?</summary>

```js
// Sélectionner le formulaire d'édition de liste
//
// Écouter l'évènement `submit` sur ce formulaire, auquel cas :
// - empêcher le comportement par défaut du formulaire
// - récupérer les données du formulaire (le nouveau titre)
// - récupérer l'ID de la liste à modifier dans les dataset de la fenêtre de dialogue
// - PATCH `/lists/:listId` avec comme body { "title": "..." }
// - récupérer le résultat de la requête PATCH, et en cas de succès
// - sélectionner la liste du DOM correspondant au bon ID
// - modifier le contenu de l'élément avec le slot `list-title` avec le nouveau titre choisi
// - fermer la fenêtre de dialogue
// - reset le formulaire
//
// Festoyer !
```

</details>

---

⚠️ **Les deux parties suivantes sont indépendantes.** ⚠️

---

## Étape 3 (BONUS) - Suppression d'une liste

Bon bah, rebelote, hein 🤪 !

Cette fois-ci, un peu plus débrouillard :

- ajouter un bouton de suppression sur les listes ;
- ouvrir une fenêtre de dialogue de « confirmation avant suppression » ;
    > **BONUS** si la liste possède des cartes :
    > - prévenir que la suppression supprimera également toutes les cartes à l'intérieur ;
    > - OU empêcher explicitement l'utilisateur de supprimer une liste qui possède des cartes.

- suite à la confirmation de la suppression, faire une requête `DELETE` vers l'API pour supprimer la liste ;
- retirer la liste de la page ;
- fermer la fenêtre de dialogue.

## Étape 4 (BONUS) - Drag & Drop

On souhaiterait pouvoir modifier la **position** des listes sur le Kanban, en glissant-déposant une liste vers un nouvel emplacement.

**Problème :** _on va quand même pas le faire à la main 🙀 ?_

**Solution :** _et bah non !_ Il existe des solutions clé-en-main pour la partie frontend.

## 4.1. Installation

Jeter un œil à la [documentation](https://github.com/SortableJS/Sortable) de `SortableJS`,
aux [démonstrations](http://sortablejs.github.io/Sortable/),
et l'installer dans le code en utilisant le script fourni via un [CDN](https://github.com/SortableJS/Sortable?tab=readme-ov-file#cdn).

> **NOTE** ce script externe doit être chargé AVANT nos scripts, sinon il ne sera pas possible d'utiliser la variable globale `Sortable`.

## 4.2. Mise en place (frontend)

Objectif n°1 : réussir à logger en `console` l'ID de la liste qui vient d'être déplacé.

<details><summary>Un peu d'aide ?</summary>

```js
Sortable.create(ELEMENT_DU_DOM_CONTENANT_LISTES, {
  onEnd(event) {
    // Callback qui se déclenche lorsque l'utilisateur déplace une liste
    console.log(event);
  }
});
```

</details>

## 4.3. Mise à jour (backend)

Objectif n°2 : réussir à sauvegarder la position actuelle de toutes les listes.

Pour **chaque** liste sur la page, récupérer sa position et exécuter une requête `PATCH /lists/:listId` (avec le bon body) afin de sauvegarder sa nouvelle position.

> **NOTE** cette approche n'est absolument pas performante, car on lance **une requête HTTP par liste**,
> ce qui peut faire beaucoup selon le nombre de listes présentes sur la page !
> Idéalement, on aimerait uniquement mettre à jour la liste qui vient d'être déplacé. Nous discuterons en cours d'autres implémentations et modélisations possibles.

<details><summary>Un peu d'aide</summary>

```js
// Dans le callback 'onEnd'

// Sélectionner toutes les listes sur la page
// Pour chaque liste :
// - récupérer son ID
// - récupérer sa position
// - faire l'appel PATCH /lists/:listId avec BODY { position: X }

```

</details>

Ré-ouvrir le projet O'kanban API (backend) et démarrer l'API sur le port de votre choix.

Vérifier que l'API répond correctement (avec Insomnia par exemple), et que votre code est à jour par rapport à la correction.

### 1.2. Lancer le front avec live server 🦾

Pour ce projet, le frontend est indépendant du backend, et on communiquera avec lui via son API.

Côté frontend, tout va se passer dans le navigateur. On va donc coder directement des fichiers statiques (`HTML`, `CSS`, `JS`). Retour au début de la formation, en quelque sorte !

### 1.3. Prise en main du code 👀

Commencer par **lire les fichiers d'intégration fournis** et repérer les éléments sur la page.
L'intégration proposée utilise le framework [CSS Bulma](https://bulma.io/). Un petit tour sur la documentation ne fait pas de mal.

Tu vas rencontrer de nombreux templates.
Un template, en html, est une sorte de composant qui n'est pas visible dans le DOM, mais qui contient du code HTML.
Celui-ci est clonable afin de l'injecter, et de potentiellement le personnaliser, afin de l'incorporer dans un autre élément du DOM.

## Étape 2 - La fenêtre de dialogue (modal)

> Une fenêtre de dialogue est une fenêtre réduite qui s'ouvre dans le navigateur par dessus le contenu courant, un peu comme une alert() ou un prompt(), mais en moins moche et surtout personnalisable et stylisable en CSS.

### 2.1. Ouvrir la fenêtre de dialogue

Tu as dû remarquer le bouton `Ajouter une liste`. Mais ce bouton… ne fait rien !

**Objectif** : lorsque l'on clique sur le bouton, tu vas devoir ouvrir l'élément `<div class="modal" id="addListModal">`

 le formulaire d'ajout de liste apparait dans cette fenêtre `modal`. À toi de jouer !

<details><summary>De l'aide ?</summary>

[documentation `modal`](https://bulma.io/documentation/components/modal/)

</details>

### 2.2. Fermer la fenêtre de dialogue

On souhaite pouvoir fermer la fenêtre de dialogue de 2 façons différentes :

- un clic sur la croix `x` en haut à droite de celle-ci ;
- un clic sur le bouton `Annuler` en bas ;

L'objectif de cette étape est de faire fonctionner ces boutons.

<details><summary>De l'aide ?</summary>

L'idée est d'enlever la classe ajouter précédemment. utiliser la méthode `.classList.remove()` de la modal lors d'un clic sur l'un des deux boutons. Comme d'habitude :

- sélectionner un élément ;
- poser un écouteur d'évènement ;
- exécuter la méthode…

</details>

### 2.3. Un peu de rangement 🧹 ?

On pourrait rassembler, dans des fonctions spécifiques et bien nommées, :

- les instructions qui posent l'écouteur pour ouvrir la fenêtre de dialogue ;
  > ex : `listenToClickOnAddListModal()`
- les instructions qui posent les écouteurs pour fermer la fenêtre de dialogue ;
  > ex : `listenToClickOnModalClosingElements()`

Puis on s'assure d'appeler ces fonctions lorsque l'intégralité du DOM est bien chargé par le navigateur :

```js
document.addEventListener("DOMContentLoaded", () => {
  // maFonction();
  // maFonction2();
});

```

## Étape 3 - Fetch fetch fetch

### 3.1. Retirer les listes codées en dur

Notre kanban présente des listes qui ont été codées en dur dans l'intégration.

On les retire pour faire place nette avant d'insérer celles provenants de l'API !

> **ATTENTION** ne pas retirer le conteneur des listes (`lists-container`) dont on aura besoin.

### 3.2. Requêter les listes via l'API

À l'aide d'une requête HTTP (via `fetch`) vers notre API, on récupère les données des listes par la route `GET /lists`.

Rappel de l'utilisation de `fetch` dans une fonction `async`.

```js
const httpResponse = await fetch(URL); // on récupère une Response
const data = await httpResponse.json(); // on transforme le corps de la réponse (JSON) en Objet JS
console.log(data);
```

Une fois les données récupérées, on les `console.log` et on passe à la suite : les afficher !

### 3.3. Insérer les listes dans la page

Maintenant que nous avons récupéré les listes, on voudrait les afficher dans la page. On pourrait utiliser des `document.createElement` à tout va, mais on va vite avoir un sacré paquet d'éléments à créer…

Mais attendez… quelle chance ! Nous avons un `<template>` HTML à notre disposition. On peut donc s'en servir pour insérer nos listes dans la page !

<details><summary>Un peu d'aide ?</summary>

```js
// === PSEUDO CODE ===

// S'assurer d'avoir bien récupérer les listes à l'étape précédente : [{ ... }, { ... }, { ... }]

// Pour chaque liste :
// - cloner le template
// - changer le textContent de l'élément avec le slot `list-title` (du clone) par le titre de la liste récupérée
//   - (penser à faire un querySelector directement sur la variable qui contient le clone !)
// - changer l'id de l'élément avec le slot `list-id` (du clone) par l'ID de la liste récupérée.
//   - (penser à faire un querySelector directement sur la variable qui contient le clone !)
// - sélectionner sur la page l'élément conteneur des listes
// - insérer le clone dans le conteneur

// Festoyer !
```

</details>

### 3.4. Un peu de rangement 🧹 ?

On pourrait rassembler, dans des fonctions spécifiques et bien nommées, :

- les instructions qui affichent une liste sur la page à partir des données d'une liste (objet) fournie en **paramètre** ;
  > ex : `addListToListsContainer(listData)`
- les instructions qui vont chercher les listes via l'API dans une fonction qui **retourne** ces listes une fois récupérées ;
  > ex : `getLists()`
- et pourquoi pas le tout dans une fonction regroupant les instructions précédentes.
  > ex : `fetchAndDisplayLists()`

## Étape 4 - Ajout d'une nouvelle liste

### 4.1. Soumission du formulaire

On reprend notre fenêtre de dialogue de l'étape 2, qui présente un formulaire HTML `<form>` à l'utilisateur.

Lorsque l'utilisateur **soumet** (`submit`) ce formulaire , on souhaite :

- empêcher le comportement par défaut du formulaire ;
  > `event.preventDefault()` : et oui, on va gérer la requête HTTP manuellement !
- récupérer les données du formulaire ;
  > une [façon efficace ici](https://www.learnwithjason.dev/blog/get-form-values-as-json/)
- les afficher en `console` pour tester ;
- fermer la fenêtre de dialogue après soumission ;
- et éventuellement `reset` le formulaire.

Une fois que les données sont bien affichées en `console`, on passe à la suite.

### 4.2. Sauvegarder la nouvelle liste

Il est temps d'exécuter une requête `POST /lists` vers notre API afin que celle-ci s'occupe de l'ajouter en base de données.

Rappel de l'utilisation de `fetch` pour une requête POST :

```js
const httpResponse = await fetch(URL, {
  method: "POST", // je cible la route `POST`
  headers: { "Content-Type": "application/json" }, // je préviens que j'envoie du JSON
  body: JSON.stringify(myData), // j'envoie mes données en JSON
});
const data = await httpResponse.json();
console.log(data); // Les données JSON renvoyées par l'API récupérées en objet JS
```

On vérifie que l'API nous renvoie une réponse correcte et que la liste a bien été ajoutée en base de données.

### 4.3. Insérer la nouvelle liste sur la page

Bonne nouvelle : nous avons déjà codé une fonction pour insérer une liste sur la page à partir des données d'une liste : `addListToListsContainer(listData)`.
On peut donc la réutiliser et insérer la liste fraichement créée dans le DOM.

### 4.4. Un peu de rangement 🧹 ?

On pourrait rassembler, dans des fonctions spécifiques et bien nommées, :

- les instructions qui écoutent la soumission du formulaire ;
  > ex : `listenToSubmitOnAddListForm()`
- les instructions qui envoient la requête `POST` et **retourne** les données renvoyées par le serveur ;
  > ex : `createList(listData)`

## Fin

**Bravo !** Vous avez réalisé votre première « _Single Page Application_ » (SPA) qui gère les données de manière dynamique,
sans recharger la page entre chaque changement d'état de la base de données !
