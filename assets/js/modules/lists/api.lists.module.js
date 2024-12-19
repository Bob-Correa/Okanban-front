import { makeList } from './lists.module';
import { hideModals, showError } from '../utils.module';
import { config } from '../config.module';

async function getLists() {
    try {
        const response = await fetch(`${config.base_url}/lists`); // on récupère une Response

        //  response.json est soit les listes, mais si une erreur se produit, response.json est une instance de la classe Error
        const maybeLists = await response.json(); // on transforme le corps de la réponse (JSON) en Objet JS
        //
        if (!response.ok) {
            throw maybeLists;
        }

        return maybeLists;
    } catch (error) {
        throw error;
    }
}

// * on doit récupérer les infos d'un formulaire
// * on doit envoyer les données du formulaire à l'API pour créer une nouvelle liste
// * quand la liste est créée, on doit l'ajouter sur le DOM
async function createList(event) {
    // * empêche le comportement par défaut d'un élément HTML : dans notre cas avec un formulaire, on empêche la page de se recharger
    event.preventDefault();
    const form = event.target;
    // * on utilise un objet FormData pour récupérer les infos du formulaire
    const formData = new FormData(form);

    //   on convertit l'objet formdata en objet litéral
    const dataObj = Object.fromEntries(formData);
    // ! décommenter pour tester la gestion d'erreur
    // dataObj.title = null;
    const response = await fetch(`${config.base_url}/lists`, {
        method: 'POST',
        // * ce header est obligatoire pour que l'API comprenne le type de données qu'on lui envoie
        headers: {
            'Content-Type': 'application/json',
        },
        // * on convertit l'objet en string pour pouvoir l'envoyer dans les tuyaux http
        body: JSON.stringify(dataObj),
    });

    const maybeNewList = await response.json();
    if (response.ok) {
        makeList(maybeNewList);

        return form.reset();
    }

    showError(maybeNewList.error);
    //   gestion d'erreur
    hideModals();
}

async function updateList(event) {
    event.preventDefault();

    // on se répète, il faudrait extraire une fonction qui récupère les données d'un formulaire
    const form = event.target;
    // * on utilise un objet FormData pour récupérer les infos du formulaire
    const formData = new FormData(form);
    //   on convertit l'objet formdata en objet litéral
    const dataObj = Object.fromEntries(formData);

    const response = await fetch(
        `${config.base_url}/lists/${dataObj.list_id}`,
        {
            method: 'PATCH',
            // * ce header est obligatoire pour que l'API comprenne le type de données qu'on lui envoie
            headers: {
                'Content-Type': 'application/json',
            },
            // * on convertit l'objet en string pour pouvoir l'envoyer dans les tuyaux http
            body: JSON.stringify(dataObj),
        }
    );

    if (response.ok) {
        const updatedList = await response.json();

        // * mise à jour de la liste sur le DOM
        const listToUpdate = document.querySelector(
            `[data-list-id="${updatedList.id}"]`
        );

        listToUpdate.querySelector('h2').textContent = updatedList.title;

        form.reset();
    }

    hideModals();
}

async function destroyList(id) {
    const response = await fetch(`${config.base_url}/lists/${id}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        return true;
    }

    return false;
}

export { getLists, createList, updateList, destroyList };
