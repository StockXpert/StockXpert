const mysql=require('mysql');
const async=require('async')
const connectionConfig = {
  host: 'bibznsnq8nf1q3j7r74o-mysql.services.clever-cloud.com',
  user: 'ucvk6cpbqavmyqnb',
  password: 'w7Xaq1AwW42V3jvOiTgb',
  database: 'bibznsnq8nf1q3j7r74o'
};
function addInventaire(numInventaire,dateInventaire)
{
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(connectionConfig);
          
        const query = `INSERT INTO inventaire (num_inventaire,date_inventaire) values (?,?)`;
        const values=[numInventaire,dateInventaire];
        connection.connect((err) => {
          if (err) {
            console.error('Erreur de connexion :', err);
            reject("connexion erreur");
            return;
          }
          
          connection.query(query,values,(error, results, fields) => {
            if (error) {
              console.error('Erreur lors de l\'exécution de la requête :', error);
              reject("request error");
              return;
            }
            resolve("success");
          });
          
          connection.end(); // Fermer la connexion après l'exécution de la requête
        });}) 
}
function insertCompter(numInventaire, produits) {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(connectionConfig);
        connection.connect((err) => {
            if (err) {
                console.error('Erreur de connexion à la base de données : ', err);
                reject(err);
                return;
            }
            console.log('Connecté à la base de données MySQL');
            
            // Commencer la transaction
            connection.beginTransaction((err) => {
                if (err) {
                    console.error('Erreur lors du démarrage de la transaction : ', err);
                    reject(err);
                    return;
                }
                console.log("Début de la transaction");
  
                // Utiliser une boucle asynchrone pour traiter chaque produit
                async.eachSeries(produits, (produit, callback) => {
                    // Exécuter la requête pour récupérer l'ID produit à partir de la désignation
                    console.log({produit})
                    connection.query('SELECT id_produit FROM produit WHERE designation = ?', [produit.designation], (err, rows) => {
                        if (err) {
                            return callback(err);
                        }
                        if (rows.length === 0) {
                            return callback("Produit non trouvé  " + produit.designation);
                        }
                        const id_produit = rows[0].id_produit;
  
                        // Insérer les données dans ma_table avec l'ID produit récupéré
                        connection.query('INSERT INTO compter (num_inventaire, id_produit, quantite_phys) VALUES (?, ?, ?)', [numInventaire, id_produit, produit.quantitePhys], (err, result) => {
                            if (err) {
                                return callback(err);
                            }
                            console.log('Produit inséré avec succès dans ma_table avec l\'ID produit : ', id_produit);
                            callback();
                        });
                    });
                }, (err) => {
                    if (err) {
                        return connection.rollback(() => {
                            console.error('Erreur lors du traitement des produits : ', err);
                            reject(err);
                        });
                    }
  
                    // Valider la transaction
                    connection.commit((err) => {
                        if (err) {
                            return connection.rollback(() => {
                                console.error('Erreur lors de la validation de la transaction : ', err);
                                reject(err);
                            });
                        }
                        console.log("Transaction validée avec succès");
                        resolve("success");
                        connection.end();
                    });
                });
            });
        });
    });}
function validInvetaireStatus(numInventaire)
{
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(connectionConfig);
          
        const query = `update inventaire set etat='valid' where num_inventaire=?`;
        const values=[numInventaire];
        connection.connect((err) => {
          if (err) {
            console.error('Erreur de connexion :', err);
            reject("connexion erreur");
            return;
          }
          
          connection.query(query,values,(error, results, fields) => {
            if (error) {
              console.error('Erreur lors de l\'exécution de la requête :', error);
              reject("request error");
              return;
            }
            resolve("success");
          });
          
          connection.end(); // Fermer la connexion après l'exécution de la requête
        });})
}    
function getInventaires()
{
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(connectionConfig);
          
        const query = `select * from inventaire`;
        connection.connect((err) => {
          if (err) {
            console.error('Erreur de connexion :', err);
            reject("connexion erreur");
            return;
          }
          
          connection.query(query,(error, results, fields) => {
            if (error) {
              console.error('Erreur lors de l\'exécution de la requête :', error);
              reject("request error");
              return;
            }
            resolve(results);
          });
          
          connection.end(); // Fermer la connexion après l'exécution de la requête
        });})
}
function getInventaire(numInventaire)
{
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(connectionConfig);
          
        const query = `select c.quantite_phys,p.quantite,p.designation 
        from compter c,produit p where p.id_produit=c.id_produit and c.num_inventaire=?`;
        const values=[numInventaire]
        connection.connect((err) => {
          if (err) {
            console.error('Erreur de connexion :', err);
            reject("connexion erreur");
            return;
          }
          
          connection.query(query,values,(error, results, fields) => {
            if (error) {
              console.error('Erreur lors de l\'exécution de la requête :', error);
              reject("request error");
              return;
            }
            resolve(results);
          });
          
          connection.end(); // Fermer la connexion après l'exécution de la requête
        });})
}
function getInventaireStatus(numInventaire)
{
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(connectionConfig);
          
        const query = `select etat from inventaire where num_inventaire=?`;
        const values=[numInventaire]
        connection.connect((err) => {
          if (err) {
            console.error('Erreur de connexion :', err);
            reject("connexion erreur");
            return;
          }
          
          connection.query(query,values,(error, results, fields) => {
            if (error) {
              console.error('Erreur lors de l\'exécution de la requête :', error);
              reject("request error");
              return;
            }
            resolve(results[0].num_inventaire);
          });
          
          connection.end(); // Fermer la connexion après l'exécution de la requête
        });})
}
function deleteInventaire(numInventaire)
{
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(connectionConfig);
          
        const query = `delete from inventaire where num_inventaire=?`;
        const values=[numInventaire];
        connection.connect((err) => {
          if (err) {
            console.error('Erreur de connexion :', err);
            reject("connexion erreur");
            return;
          }
          
          connection.query(query,values,(error, results, fields) => {
            if (error) {
              console.error('Erreur lors de l\'exécution de la requête :', error);
              reject("request error");
              return;
            }
            resolve("success");
          });
          connection.end(); // Fermer la connexion après l'exécution de la requête
        });})
}
function updateInventaire(numInventaire,produits)
{ 
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(connectionConfig);
        connection.connect((err) => {
            if (err) {
                console.error('Erreur de connexion à la base de données : ', err);
                reject(err);
                return;
            }
            console.log('Connecté à la base de données MySQL');
            
            // Commencer la transaction
            connection.beginTransaction((err) => {
                if (err) {
                    console.error('Erreur lors du démarrage de la transaction : ', err);
                    reject(err);
                    return;
                }
                console.log("Début de la transaction");
  
                // Utiliser une boucle asynchrone pour traiter chaque produit
                async.eachSeries(produits, (produit, callback) => {
                    // Exécuter la requête pour récupérer l'ID produit à partir de la désignation
                    console.log({produit})
                    connection.query('SELECT id_produit FROM produit WHERE designation = ?', [produit.designation], (err, rows) => {
                        if (err) {
                            return callback(err);
                        }
                        if (rows.length === 0) {
                            return callback("Produit non trouvé  " + produit.designation);
                        }
                        const id_produit = rows[0].id_produit;
  
                        // Insérer les données dans ma_table avec l'ID produit récupéré
                        connection.query('update compter set quantite_phys=? where id_produit=? and num_inventaire=?', [produit.quantitePhys, id_produit,numInventaire], (err, result) => {
                            if (err) {
                                return callback(err);
                            }
                            console.log('Produit inséré avec succès dans ma_table avec l\'ID produit : ', id_produit);
                            callback();
                        });
                    });
                }, (err) => {
                    if (err) {
                        return connection.rollback(() => {
                            console.error('Erreur lors du traitement des produits : ', err);
                            reject(err);
                        });
                    }
  
                    // Valider la transaction
                    connection.commit((err) => {
                        if (err) {
                            return connection.rollback(() => {
                                console.error('Erreur lors de la validation de la transaction : ', err);
                                reject(err);
                            });
                        }
                        console.log("Transaction validée avec succès");
                        resolve("success");
                        connection.end();
                    });
                });
            });
        });
    });
}
function deleteCompter(numInventaire) {
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection(connectionConfig);
      
    const query = `delete from compter where num_inventaire=?`;
    const values=[numInventaire];
    connection.connect((err) => {
      if (err) {
        console.error('Erreur de connexion :', err);
        reject("connexion erreur");
        return;
      }
      
      connection.query(query,values,(error, results, fields) => {
        if (error) {
          console.error('Erreur lors de l\'exécution de la requête :', error);
          reject("request error");
          return;
        }
        resolve("success");
      });
      
      connection.end(); // Fermer la connexion après l'exécution de la requête
    });}) }
function inscriptionDate(produit,year)
{
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection(connectionConfig);
      
    const query = `select min(b.date_reception) from bon_de_reception b,livre l
    where b.num_bon=l.num_bon and l.id_produit=? and year(b.date_reception)=?`;
    const values=[produit,year];
    connection.connect((err) => {
      if (err) {
        console.error('Erreur de connexion :', err);
        reject("connexion erreur");
        return;
      }
      
      connection.query(query,values,(error, results, fields) => {
        if (error) {
          console.error('Erreur lors de l\'exécution de la requête :', error);
          reject("request error");
          return;
        }
        resolve(results);
      });
      
      connection.end(); // Fermer la connexion après l'exécution de la requête
    });})
}
function avgProductValue(produit,year)
{
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection(connectionConfig);
      
    const query = `select avg(c.prix_unitaire) from bon_de_commande b,commande c
    where b.num_commande=c.id_commande and  c.id_produit=? and year(b.date_commande)=?`;
    const values=[produit,year];
    connection.connect((err) => {
      if (err) {
        console.error('Erreur de connexion :', err);
        reject("connexion erreur");
        return;
      }
      
      connection.query(query,values,(error, results, fields) => {
        if (error) {
          console.error('Erreur lors de l\'exécution de la requête :', error);
          reject("request error");
          return;
        }
        resolve(results);
      });
      
      connection.end(); // Fermer la connexion après l'exécution de la requête
    });})
}
function getProductFournisseur(produit,year)
{
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection(connectionConfig);
      
    const query = `select f.raison_sociale,count(c.id_produit) as nombre  from bon_de_commande b,commande c,fournisseur f
    where b.num_commande=c.id_commande and  c.id_produit=? and year(b.date_commande)=?
    and f.id_fournisseur=b.id_fournisseur
     Group by f.raison_sociale
     order by nombre desc limit 1 `;
    const values=[produit,year];
    connection.connect((err) => {
      if (err) {
        console.error('Erreur de connexion :', err);
        reject("connexion erreur");
        return;
      }
      
      connection.query(query,values,(error, results, fields) => {
        if (error) {
          console.error('Erreur lors de l\'exécution de la requête :', error);
          reject("request error");
          return;
        }
        resolve(results[0].raison_sociale);
      });
      
      connection.end(); // Fermer la connexion après l'exécution de la requête
    });})
}
function getInventaireYear(numInventaire)
{
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection(connectionConfig);
      
    const query = `select year(date_inventaire) as year ,date_inventaire from inventaire where num_inventaire=?`;
    const values=[numInventaire];
    connection.connect((err) => {
      if (err) {
        console.error('Erreur de connexion :', err);
        reject("connexion erreur");
        return;
      }
      
      connection.query(query,values,(error, results, fields) => {
        if (error) {
          console.error('Erreur lors de l\'exécution de la requête :', error);
          reject("request error");
          return;
        }
        resolve(results[0].year);
      });
      
      connection.end(); // Fermer la connexion après l'exécution de la requête
    });})
}
function getInventaireProducts(numInventaire)
{
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection(connectionConfig);
      
    const query = `select id_produit as id_produit , p.designation from compter c,produit p
     where c.num_inventaire=?  c.id_produit=p.id_produit`;
    const values=[numInventaire];
    connection.connect((err) => {
      if (err) {
        console.error('Erreur de connexion :', err);
        reject("connexion erreur");
        return;
      }
      
      connection.query(query,values,(error, results, fields) => {
        if (error) {
          console.error('Erreur lors de l\'exécution de la requête :', error);
          reject("request error");
          return;
        }
        resolve(results);
      });
      
      connection.end(); // Fermer la connexion après l'exécution de la requête
    });})
}
function insertLink(numInventaire,link,link2)
{
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection(connectionConfig);
    const query = `update inventaire set link=?,excel_link=? where num_inventaire=?`;
    const values = [link,link2,numInventaire];
  
    connection.connect((err) => {
      if (err) {
        console.error('Erreur de connexion :', err);
        reject("connexion erreur");
        return;
      }
      
      connection.query(query, values, (error, results, fields) => {
        if (error) {
          console.error('Erreur lors de l\'exécution de la requête :', error);
          reject("request error");
          return;
        }
        resolve('success');
      });
      
      connection.end(); // Fermer la connexion après l'exécution de la requête
    });
  });
}
module.exports={addInventaire,insertCompter,validInvetaireStatus,getInventaires,getInventaire,getInventaireStatus
,deleteInventaire,updateInventaire,deleteCompter,getProductFournisseur,avgProductValue,inscriptionDate,
getInventaireYear,getInventaireProducts,insertLink}