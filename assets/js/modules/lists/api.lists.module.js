import { makeList } from './lists.module';
import { hideModals } from '../utils.module';
import { config } from '../config.module';

async function getLists() {
    const response = await fetch(`${config.base_url}/lists`); // on récupère une Response
    const lists = await response.json(); // on transforme le corps de la réponse (JSON) en Objet JS

    return lists;
}

async function createList(event) {
    // * empêche le comportement par défaut d'un élément HTML : dans notre cas avec un formulaire, on empêche la page de se recharger
    event.preventDefault();
    const form = event.target;
    // * on utilise un objet FormData pour récupérer les infos du formulaire
    const formData = new FormData(form);

    //   on convertit l'objet formdata en objet litéral
    const dataObj = Object.fromEntries(formData);

    const response = await fetch(`${config.base_url}/lists`, {
        method: 'POST',
        // * ce header est obligatoire pour que l'API comprenne le type de données qu'on lui envoie
        headers: {
            'Content-Type': 'application/json',
        },
        // * on convertit l'objet en string pour pouvoir l'envoyer dans les tuyaux http
        body: JSON.stringify(dataObj),
    });

    if (response.ok) {
        const newList = await response.json();

        makeList(newList);

        form.reset();
    }
    //   gestion d'erreur
    hideModals();
}

export { getLists, createList };
