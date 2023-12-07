const connexion = require("../config/bdcommerce")

exports.getAllProduits = () =>  {
    return new Promise((resolve , reject) => {
        connexion.query("SELECT * FROM produits", (error, rows, fields) => {
            if (error) {
                console.log(error)
                reject(error)
            } else { 
                const produits = JSON.parse(JSON.stringify(rows));
                console.log(produits)
                resolve(produits)
            }
        })
    })
}

exports.getProduitId = (id) =>  {
    return new Promise((resolve, reject) => {
        const productId = parseInt(id);
        connexion.query("SELECT * FROM produits WHERE idproduit = ?", [productId], (error, rows, fields) => {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                console.log(rows);
                resolve(rows);
            }
        });
    });
};

exports.getNomProduits = (nom) => {
    return new Promise((resolve, reject) => {
        // Ajout du caractère de joker % pour les correspondances partielles
        const rechercheNom = `%${nom}%`;

        connexion.query("SELECT * FROM produits WHERE nom LIKE ?", [rechercheNom], (error, rows, fields) => {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                console.log(rows);
                resolve(rows);
            }
        });
    });
};


exports.createProduct = (newProduit) => {
    return new Promise((resolve, reject) => {
        connexion.query("INSERT INTO produits SET ?", newProduit, (error, resultat) => {
            if (error) {
                console.error('Erreur lors de l\'insertion du produit:', error);
                reject(error);
            } else {
                console.log('Nouveau produit créé, ID:', resultat.insertId);
                resolve(resultat.insertId);
            }
        });        
    })
}

exports.updateProduit = (id, produitUpdate) => {
    return new Promise((resolve, reject) => {
        connexion.query("UPDATE produits SET ? WHERE idproduit = ?", [produitUpdate, id], (error, resultat) => {
            if (error) {
                console.error('Erreur lors de la mise à jour du produit :', error);
                reject(error);
            } else {
                console.log("Nouveau produit après la mise à jour", produitUpdate)
                resolve(resultat.message);
            }
        });
    });
};


exports.deleteProduit = (id) => {
    return new Promise((resolve, reject) => {        
        connexion.query("DELETE FROM produits WHERE idproduit = ?", [id], (error, resultat) => {
            if (error) {
                console.error('Erreur lors de la suppression du produit :', error);
                reject(error);
            } else {
                console.log('Produit supprimé, ID:', id);
                resolve(`Produit avec l'ID ${id} a été supprimé.`);
            }
        });
    });
};
