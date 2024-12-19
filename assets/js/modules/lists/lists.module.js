import Sortable from 'sortablejs';
import { destroyList } from './api.lists.module';
import { config } from '../config.module';

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

function dragNDropList() {
    // * Pour que le drag n drop fonctionne, on doit donner un conteneur à Sortable, et automatiquement, les enfants du conteneur seront déplaçables
    const listsContainer = document.getElementById('lists-container');

    Sortable.create(listsContainer, {
        animation: 500,
        onEnd: () => {
            // * Quand on termine le drag n drop , on veut mettre à jour la position de chaque liste sur l'API
            const lists = document.querySelectorAll('#lists-container .panel');

            // le callback doit être async à cause de la fonction update qui est async
            lists.forEach(async (list, index) => {
                // l'index du NodeList (le type de donnée qui contient nos listes) est comme celui d'un tableau, il commence à 0, on lui ajoute 1 pour avoir une position que l'on pourra enregistrer en BDD
                const position = index + 1;
                // on doit récupérer l'ID de la liste pour pouvoir faire la mise à jour de la bonne liste
                const listId = list.getAttribute('data-list-id');

                try {
                    await fetch(`${config.base_url}/lists/${listId}`, {
                        method: 'PATCH',
                        // * ce header est obligatoire pour que l'API comprenne le type de données qu'on lui envoie
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        // * on convertit l'objet en string pour pouvoir l'envoyer dans les tuyaux http
                        body: JSON.stringify({ position: position }),
                    });
                } catch (error) {
                    console.log(error);
                }
            });
        },
    });
}

export { showAddListModal, makeList, dragNDropList };
