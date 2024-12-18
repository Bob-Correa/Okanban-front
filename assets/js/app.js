import { makeList } from './modules/lists/lists.module.js';
import { addModalListeners } from './modules/utils.module.js';
import { getLists } from './modules/lists/api.lists.module.js';

async function init() {
  try {
    addModalListeners();

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
