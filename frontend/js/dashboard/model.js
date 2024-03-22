// import { async } from 'regenerator-runtime';
import { API_URL, TIMEOUT_SEC } from './config.js';
import { getJSON, sendJSON } from './helpers.js';
export const state = {
  search: {
    query: '',
    results: [],
  },
};
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    //TODO: ${API_URL}
    const data = await getJSON(`http://localhost:3000/Users/showConsumers`);
    console.log(data);

    state.search.results = data.response.map(usr => {
      return {
        email: usr.email,
        prenom: usr.prenom,
        nom: usr.nom,
      };
    });
  } catch (err) {
    console.log(`${err} 💔`);
    throw err;
  }
};
