import { makeList } from './modules/lists/lists.module';
import { addListeners } from './modules/utils.module';
import { getLists } from './modules/lists/api.lists.module';

async function init() {
    try {
        addListeners();

        const lists = await getLists();

        for (const list of lists) {
            makeList(list);
        }
    } catch (e) {
        console.error(e.message);
        console.error(e);
    }
}

// on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
document.addEventListener('DOMContentLoaded', init);
