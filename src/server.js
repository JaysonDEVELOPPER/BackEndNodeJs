const cors = require("cors"); // Utiliser le module cors
const express = require("express"); // Utilise le FrameWork 
const app = express();
const connection = require("./config/bdcommerce"); // lien avec la base de données 
const bodyParser = require("body-parser"); // Import module body-parsesr
// const routesProducts = require("");
const usersRoutes = require("./routes/users-routes"); // definis la route users-routes
require("dotenv").config(); // utilisée pour charger et configurer les variables d'environnement à partir d'un fichier .env dans une application Node.js. Explications détaillées :

connection.connect(error => { // etablie une connexion a la base de données
    if(error) throw error; // afficher si il y a une erreur de connexion 
    console.log("Vous êtes bien connectez la base de donnée") // Affiche si la connection est correcte
});

app.use(cors()); // politique de sécurité n'autorise explicitement ces requêtesdepuis le domaine externe
app.use(bodyParser.json()); // traites et analyser les données en json
app.use("/users", usersRoutes); // indique la routes qu'il doit prendre

app.listen(process.env.PORT, () => {// Écouter les connexions sur le port spécifié dans la variable d'environnement PORT
    console.log("L'application tourne correctement sur le port " + process.env.PORT); // Retourne un message avec le port de connection 
});