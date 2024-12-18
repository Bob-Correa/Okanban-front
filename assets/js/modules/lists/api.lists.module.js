async function getLists() {
  const base_url = 'http://localhost:3000';
  const response = await fetch(`${base_url}/lists`); // on récupère une Response
  const lists = await response.json(); // on transforme le corps de la réponse (JSON) en Objet JS

  return lists;
}

export { getLists };
