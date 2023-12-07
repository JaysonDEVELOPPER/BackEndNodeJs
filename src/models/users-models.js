const connection = require("../config/bdcommerce"); // connection a la base de données

exports.getAllUsers = () => {
  return new Promise((resolve, reject) => {
    // return une promesse
    connection.query("SELECT * FROM users", (error, rows, fields) => {
      // se connecter a la base de donné avec un request mysql pour retrouver tout les users
      if (error) {
        // si il y a une erreur return la moi
        console.log(error);
        reject(error);
      } else {
        const userDb = JSON.parse(JSON.stringify(rows));
        console.log(userDb);
        resolve(userDb); // sinon affiche moi ce que tu retrouves
      }
    });
  });
};

exports.getByName = (nom) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM users WHERE users.nom LIKE "%${nom}%"`,
      (error, rows, fields) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          const userId = JSON.parse(JSON.stringify(rows));
          console.log(userId);
          resolve(userId);
        }
      }
    );
  });
};

// Fonction pour récupérer un utilisateur par son ID
exports.getById = (id) => {
  return new Promise((resolve, reject) => {
    // Exécute une requête SQL pour sélectionner un utilisateur par son ID
    connection.query(
      `SELECT * FROM users WHERE users.iduser = "${id}"`,
      (error, rows, fields) => {
        if (error) {
          // En cas d'erreur lors de l'exécution de la requête SQL
          console.log(error);
          reject(error);
        } else {
          // Transforme les résultats de la requête en objet JSON
          const userId = JSON.parse(JSON.stringify(rows));
          // Affiche les résultats dans la console
          console.log(userId);
          // Résout la promesse avec les résultats
          resolve(userId);
        }
      }
    );
  });
};

exports.createUser = (infosUsers) => {
  return new Promise((resolve, reject) => {
    connection.query("INSERT INTO users SET ?", infosUsers, (error, result) => {
        if (error) {
            console.log(error)
            reject(error)
        } else { 
            console.log("Nouveau utilisateur créer", result.insertId);
            resolve(result.insertId)
        }
    })
  });
};

exports.getByEmail = (email) => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM users WHERE email = ?', [email], (error, rows, fields) => {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                const user = JSON.parse(JSON.stringify(rows[0]));
                console.log(user);
                resolve(user);
            }
        });
    });
};

exports.updateUser = (id, update) => {
    return new Promise((resolve, reject) => {
        connection.query("UPDATE users SET ? WHERE iduser = ?", [update,id], (error, result) => {
            if (error) {
                console.log(error)
                reject(error)
            } else {
                console.log("Utilisateur non à jours : ", result.affectedRow)
                resolve(result.affectedRow)
            }
        })
    })
}

exports.deleteUser = (id) => {
  return new Promise((resolve, reject) => {
    connection.query("DELETE FROM users WHERE iduser = ?", [id], (error, result) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log("Utilisateur supprimé, ID:", id);
        resolve(`Utilisateur avec l'ID ${id} a été supprimé.`);
      }
    });
  });
};