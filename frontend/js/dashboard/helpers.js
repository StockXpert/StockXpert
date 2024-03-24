import { TIMEOUT_SEC } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// export const AJAX = async function (url, uploadData = undefined) {
//   try {
//     const fetchPro = uploadData
//       ? fetch(url, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(uploadData),
//         })
//       : fetch(url);

//     const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
//     const data = await res.json();

//     if (!res.ok) throw new Error(`${data.message} (${res.status})`);
//     return data;
//   } catch (err) {
//     throw err;
//   }
// };
export const getJSON = async function (url) {
  try {
    // console.log(localStorage.getItem('JWT'));
    const fetchPro = fetch(url, {
      method: 'GET',
      headers: {
        Authorization: localStorage.getItem('JWT'),
        'content-Type': 'application/json',
      },
    });
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    // console.log(data);
    //   const data = JSON.parse(`[
    //     {
    //         "email": "Amrane@esi-sba.dz",
    //         "prenom": "Abdelkader",
    //         "nom": "Amrane",
    //         "structure": "DED",
    //         "date_naissance": "0000-00-00",
    //         "type": null
    //     },
    //     {
    //         "email": "Fetitah@esi-sba.dz",
    //         "prenom": "Omar",
    //         "nom": "FETITAH",
    //         "structure": "DCP",
    //         "date_naissance": "0000-00-00",
    //         "type": null
    //     },
    //     {
    //         "email": "Kies@esi-sba.dz",
    //         "prenom": "Nadia",
    //         "nom": "KIES",
    //         "structure": "DSC",
    //         "date_naissance": "0000-00-00",
    //         "type": null
    //     },
    //     {
    //         "email": "Zelmat@esi-sba.dz",
    //         "prenom": "Fatima",
    //         "nom": "ZELMAT",
    //         "structure": "DRE",
    //         "date_naissance": "0000-00-00",
    //         "type": null
    //     },
    //     {
    //         "email": "Kechakch@esi-sba.dz",
    //         "prenom": "SidAhmed",
    //         "nom": "KECHKACH",
    //         "structure": "SG",
    //         "date_naissance": "0000-00-00",
    //         "type": null
    //     },
    //     {
    //         "email": "Abdelhak@esi-sba.dz",
    //         "prenom": "Assia",
    //         "nom": "ABDELHAK",
    //         "structure": "DG",
    //         "date_naissance": "0000-00-00",
    //         "type": null
    //     }
    // ]`);

    // if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        Authorization: localStorage.getItem('JWT'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

export const truncateEmail = function (email) {
  const formatWord = function (word) {
    return word.replace(/([a-z])([A-Z])/g, '$1 $2');
  };
  // split the email address at the @ symbol
  let parts = email.split('@');
  // set the part before the @ symbol
  let truncatedPart = parts[0];
  truncatedPart = formatWord(truncatedPart);
  return truncatedPart;
};
export const capitalizeWord = function (word) {
  return word.toUpperCase();
};
export const capitalizeFirstLetter = function (word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
};
export const roleTranslator = function (Brole) {
  switch (Brole) {
    case 'Service achat':
      return 'S. Achat';
    case 'Magasinier':
      return 'Magasinier';
    case 'Directeur':
      return 'Directeur';
    case 'SG':
      return 'SG';
    case 'Responsable directe':
      return 'Resp. Direct';
    case 'Consommateur':
      return 'Consommateur';
    case 'Administrateur System':
      return 'Administrateur';
  }
};
