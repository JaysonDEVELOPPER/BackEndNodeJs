const {
  getAllUsers,
  getByName,
  getById,
  createUser,
  getByEmail,
  getByEmailVerif,
  updateUser,
  deleteUser,
  getByIdlVerif,
} = require("../models/users-models"); // routes vers le model et le nom de la function appeler
const bcrypt = require("bcrypt"); // permet d'utiliser la bibliotèque pour hash les passwords
const jwt = require("jsonwebtoken"); // permet de verifier et de comparer
require("dotenv").config();

exports.getAll = async (req, res) => {
  // function asynchrone avec req body et response
  try {
    const allUserss = await getAllUsers(); // constance qui attend la response de la fonction
    res
      .status(200)
      .json({ data: allUserss, message: "Utilisateur correctement trouver" }); // Si tout fonctionne bien retourne moi l'ensemble des données avec un message
  } catch (error) {
    // capture une erreur
    res.status(500).json({ error: "Impossible erreur 500 users all" }); // return une erreur si quelque choses c'est mal passer..
  }
};

exports.getByNames = async (req, res) => {
  try {
    const nameUser = req.params.nom;
    const userName = await getByName(nameUser);
    if (userName.length === 0) {
      return res
        .status(200)
        .json({ message: "Utilisateur non trouvé ou n'existe pas" });
    }
    res.status(200).json({ data: userName, message: "Utilisateur trouver !" });
  } catch (error) {
    res.status(500).json({ error: "Erreur 500 controller par nom " });
  }
};

exports.getByIds = async (req, res) => {
  try {
    const nameId = parseInt(req.params.id); // convertis en integer le resultat
    const IdName = await getById(nameId); // appel a la function avec le paramettre
    if (IdName.length === 0) {
      // si nous retrouvons pas d'élément ou d'index adressés
      return res
        .status(200)
        .json({ message: "Utilisateur non trouvé ou n'existe pas" });
    }
    res.status(200).json({ data: IdName, message: "Utilisateur trouvé !" }); // sinon utilisateur correctement retrouver
  } catch (error) {
    res.status(500).json({ error: "Erreur 500 controller par nom" }); // capture l'erreur
  }
};

exports.createUsers = async (req, res) => {
  try {
    const champsObligatoire = ["nom", "prenom", "age", "email", "password"];
    const champsManquants = [];

    for (const champs of champsObligatoire) {
      if (!req.body[champs]) {
        champsManquants.push(champs);
      }
    }

    if (champsManquants.length > 0) {
      return res
        .status(400)
        .json({ message: `Champs manquants : ${champsManquants.join(", ")}.` });
    }

    const userBd = await getByEmailVerif(req.body.email);
    if (userBd === req.body.email) {
      return res.status(404).json({ message: "Email déjà utilisez ! " });
    }

    const dejaPresent = await getByEmail(req.body.email); // regarde si l'email est déjà présente dans la bd
    if (dejaPresent.length > 0) {
      return res.status(400).json({
        message: "Cet email est déjà utilisé par un autre utilisateur.",
      });
    }

    const userInfos = {
      // request du body permet de recuper les données
      nom: req.body.nom,
      prenom: req.body.prenom,
      age: parseInt(req.body.age),
      email: req.body.email,
      password: req.body.password,
      role: req.body.role || "client",
    };
    const passwordHashed = await bcrypt.hash(userInfos.password, 10); // permet de transformer un Password en hasher
    userInfos.password = passwordHashed; // change la valeur password et remet à jours
    const userCreate = await createUser(userInfos); // appel la fonction et passe le l'object recuper
    res
      .status(200)
      .json({ userCreate, message: "Utilisateur créer avec succées!" });
  } catch (error) {
    res.status(500).json({
      error: error,
      message: "Erreur 500 lors de la creation de l'utilisateur ",
    });
  }
};

exports.updateUsers = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log("ok");
    const userBd = await getByIdlVerif(id);
    console.log(userBd + ' ' + '  ATTENTION ICI ! ')

    console.log(userBd);
    
    // Construire l'objet userUpdateNew avec les champs modifiés
    const userUpdateNew = {
      nom: req.body.nom || userBd.nom,
      prenom: req.body.prenom || userBd.prenom,
      age: parseInt(req.body.age) || parseInt(userBd.age),
      email: req.body.email || userBd.email,
      password: req.body.password || userBd.password,
      role: req.body.role || "client",
    };

    console.log("Nouvel email :", userUpdateNew.email);

    // Si l'e-mail est modifié
if (req.body.email && req.body.email !== userBd.email) {
  console.log("Email modifié. Vérification de la disponibilité...");

  // Vérifier si l'e-mail est déjà utilisé par un autre utilisateur
  const emailExists = await getByEmailVerif(userUpdateNew.email);
  console.log("Email existant :", emailExists);

  // Si l'e-mail existe et ne correspond pas à l'utilisateur actuel
  if (emailExists && emailExists.iduser !== id) {
    console.log("L'e-mail est déjà utilisé par un autre utilisateur.");
    return res.status(400).json({
      message: "Cet email est déjà utilisé par un autre utilisateur.",
    });
  }
}


    // Si un mot de passe est fourni, le hasher
    if (userUpdateNew.password) {
      const passwordHashed = await bcrypt.hash(userUpdateNew.password, 10);
      userUpdateNew.password = passwordHashed;
    }

    // Mettre à jour l'utilisateur
    const affectedRow = await updateUser(id, userUpdateNew);
    res.status(200).json({
      affectedRow: affectedRow,
      message: "Utilisateur a bien été modifié !",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error,
      message: "Erreur 500 dans le contrôleur de mise à jour d'utilisateur.",
    });
  }
};



exports.deleteUsers = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const userExist = await getById(id);
    if (!userExist || userExist.length === 0) {
      return res
        .status(404)
        .json({ message: `Utilisateur avec l'ID ${id} n'existe pas.` });
    }

    const deleteUsers = await deleteUser(id);
    return res.status(200).json({
      deleteUserss: deleteUsers,
      message: `Utilisateur correctement supprimer`,
    });
  } catch (error) {
    console.error("Erreur dans le contrôleur deleteUser :", error);
    res.status(500).json({
      error,
      message: "Erreur lors de la suppression de l'utilisateur.",
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const infosUser = { email: req.body.email, password: req.body.password };
    console.log(infosUser.password);
    const userBd = await getByEmailVerif(infosUser.email);
    if (!userBd) {
      return res.status(400).json({
        message: "Aucun compte trouvez a cette email : ",
        infosUser: infosUser.email,
      });
    }
    console.log(infosUser.email);
    let storedPassword = userBd.password;
    console.log(storedPassword);
    if (userBd.password && infosUser.password) {
      let isPasswordValid;

      try {
        isPasswordValid = await bcrypt.compare(
          infosUser.password,
          storedPassword
        );
      } catch (error) {
        console.log("Erreur lors de la comparaison", error);
        return res
          .status(503)
          .json({ message: "Erreur de comparaison du mot de passe" });
      }

      if (isPasswordValid) {
        const token = jwt.sign(
          { userId: userBd.email, role: userBd.role },
          process.env.JWT_KEY
        );
        console.log("token généré avec succès", token);
        return res
          .status(200)
          .json({
            token: token,
            message: "Vous êtes maintenant connecté " + userBd.nom,
          });
      } else {
        console.log("Le mot de passe n'est pas valide");
        return res
          .status(503)
          .json({ message: "Le mot de passe n'est pas valide" });
      }
    } else {
      console.log(
        "Le mot de passe n'est pas défini correctement dans la base de données ou dans la requête."
      );
      return res
        .status(503)
        .json({ message: "Erreur de comparaison du mot de passe" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Une erreur est survenue", error: error });
  }
};
