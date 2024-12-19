import { destroyList } from './api.lists.module';
// * pour que la modal apparaisse on doit lui ajouter la classe is-active
// * on doit sélectionner la modal
// * quand on clique sur le bouton, on ajoute la classe is-active sur la modal
function showAddListModal() {
    const modal = document.querySelector('#addListModal');
    modal.classList.add('is-active');
    //   modal.className = 'is-active';
}

function showEditListModal(id) {
    const modal = document.querySelector('#editListModal');
    modal.classList.add('is-active');

    //  on sélectionne l'input caché et on lui donne la valeur de l'id de la liste que l'on vient de cliquer
    modal.querySelector('input[type=hidden]').value = id;

    // on récupère les infos qui sont sur le DOM car elles sont dynamiques, et donc ça dynamise la valeur inpout automatiquement
    const listToUpdate = document.querySelector(`[data-list-id="${id}"]`);
    //  on sélectionne l'input title et on lui donne la valeur du titre de la liste que l'on vient de cliquer
    const inputTitle = modal.querySelector('input[name=title]');
    inputTitle.value = listToUpdate.querySelector('h2').textContent;

    // inputTitle.setAttribute('placeholder', 'un trux');
}

async function confirmDeleteList(id) {
    // effacer qqchose est une opération sensible : donc on fait attention
    if (!window.confirm('Etes vous sur de vouloir effacer cette liste ?')) {
        return false;
    }

    // si on arrive ici, le client a dit oui, donc on efface la liste
    const ok = await destroyList(id);

    if (ok) {
        // efface la liste du DOm
        const list = document.querySelector(`[data-list-id="${id}"]`);
        list.remove();
    }
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

    const editBtn = clone.querySelector('.js-editList-btn');
    editBtn.addEventListener('click', () => showEditListModal(list.id));

    const deleteBtn = clone.querySelector('.js-deleteList-btn');
    deleteBtn.addEventListener('click', () => confirmDeleteList(list.id));

    // l'attribut HTML custom data-* permet de stocker dans le html des infos dont on aurait besoin pour faire des URL, des formulaires etc etc : la fin de l'histoire
    //   data-*
    //   console.log(listDataAttr);
    const panel = clone.querySelector('.panel');

    // deux façons de faire pour mettre à jour l'attribut data-list-id dans le HTML
    // dataset :
    //  panel.dataset.listId = list.id;
    // la méthode setAttribute
    panel.setAttribute('data-list-id', list.id);
    // la méthode setAttribute sert à mettre en place tous type d'attributs
    // panel.setAttribute('class', `js-${list.id}`);

    document.getElementById('lists-container').appendChild(clone);
}

export { showAddListModal, makeList };
