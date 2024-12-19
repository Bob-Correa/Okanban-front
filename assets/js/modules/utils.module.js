import { showAddListModal } from './lists/lists.module';
import { createList, updateList } from './lists/api.lists.module';

function hideModals() {
    const modal = document.querySelector('.is-active');
    modal.classList.remove('is-active');
}

function addListeners() {
    // afficher une modal quand on clique sur un bouton
    // sélectionner le bouton qui va afficher la modal d'ajout de liste
    const addListBtn = document.getElementById('addListButton');
    // ajouter un event listener sur ce bouton, l'event listener est le click
    // quand on clique sur le bouton la modal apparait
    addListBtn.addEventListener('click', showAddListModal);
    // sélectionner tous les boutons avec la classe .close
    // quand on clique sur un de ces boutons on cache la modal
    // const hideModalsBtns = document.getElementsByClassName('close');
    const hideModalsBtns = document.querySelectorAll(
        '.close, .modal-background'
    );
    for (let i = 0; i < hideModalsBtns.length; i++) {
        hideModalsBtns[i].addEventListener('click', hideModals);
    }

    //   * ajout de l'event submit au form de création de liste
    // * on doit créer une nouvelle liste
    // * on doit ajouter un event listener au formulaire de création de liste (submit)
    const addListform = document.querySelector('#addListModal form');
    addListform.addEventListener('submit', createList);

    //   * ajout de l'event submit au form de mise à jour de liste
    const editListForm = document.querySelector('#editListModal form');
    editListForm.addEventListener('submit', updateList);
}

export { addListeners, hideModals };
