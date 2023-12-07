const cors = require("cors");
const express = require("express");
const app = express();
const connection = require("./config/bdcommerce");
// const bodyParser = require();
// const routesProducts = require("");
// const usersRoutes = require();
require("dotenv").config();

connection.connect(error => { // etablie une connexion a la base de données
    if(error) throw error; // afficher si il y a une erreur de connexion 
    console.log("Vous êtes bien connectez la base de donnée") // Affiche si la connection est correcte
});

app.use(cors()); // politique de sécurité n'autorise explicitement ces requêtesdepuis le domaine externe


app.listen(process.env.PORT, () => {// Écouter les connexions sur le port spécifié dans la variable d'environnement PORT
    console.log("L'application tourne correctement sur le port " + process.env.PORT); // Retourne un message avec le port de connection 
});