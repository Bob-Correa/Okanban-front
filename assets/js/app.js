import { makeList } from './modules/lists/lists.module';
import { addListeners, showError } from './modules/utils.module';
import { getLists } from './modules/lists/api.lists.module';

async function init() {
    try {
        addListeners();

        const lists = await getLists();

        for (const list of lists) {
            makeList(list);
        }
    } catch (e) {
        showError(e.error);
    }
}

// on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
document.addEventListener('DOMContentLoaded', init);
