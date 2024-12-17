async function init() {
  try {
    console.log('init ok');
  } catch (e) {
    console.log(e);
  }
}

// on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
document.addEventListener('DOMContentLoaded', init);
