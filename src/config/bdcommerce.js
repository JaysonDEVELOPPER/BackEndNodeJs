const mysql = require("mysql") // recuper le module pour la base de donnée 

const connection = mysql.createConnection({ // methode fournie par la bibliothèque pour connecter bd
    host: "localhost",
    user: "root", // utilisateur nom de connection
    password: "", // MOT DE PASSE VIDE
    database: "commerce" // nom de la base de donné où je voudrais me connecté
})

module.exports = connection; // Module pour pouvoir accéder a la connection de ma base de donné

