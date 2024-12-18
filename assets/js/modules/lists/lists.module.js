// * pour que la modal apparaisse on doit lui ajouter la classe is-active
// * on doit sélectionner la modal
// * quand on clique sur le bouton, on ajoute la classe is-active sur la modal
function showAddListModal() {
  const modal = document.querySelector('#addListModal');
  modal.classList.add('is-active');
  //   modal.className = 'is-active';
}

/**
 * * Cette fonction clone un template du DOM et sert à afficher nos listes sur la page
 * @param {object} list
 */
function makeList(list) {
  const listTemplate = document.querySelector('#list-template');
  const clone = document.importNode(listTemplate.content, true);

  const title = clone.querySelector('h2');
  title.textContent = list.title;

  const input = clone.querySelector('[name="list_id"]');
  input.value = list.id;

  // l'attribut HTML custom data-* permet de stocker dans le html des infos dont on aurait besoin pour faire des URL, des formulaires etc etc : la fin de l'histoire
  //   data-*
  //   const listDataAttr = clone.dataset.listId;
  //   console.log(listDataAttr);

  document.getElementById('lists-container').appendChild(clone);
}

export { showAddListModal, makeList };
