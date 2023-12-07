const {getAllProduits,getProduitId, getNomProduits,createProduct,updateProduit, deleteProduit} = require("../models/produits-models.js")

exports.getAll = async (req,res) => {
    try {
        const getAllProduit = await getAllProduits();
        res.status(200).json({getAllProduit: getAllProduit, message: "Touts Produits correctement trouvés"})
    } catch (error) {
        res.status(500).json({error: error, message: "Erreur 500 controllers produits getAll "})
    }
}

exports.getProduitsId = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const getById = await getProduitId(id);

        if (!getById.length > 0) {
            return res.status(400).json({message: `Aucun produit est associer à ID:  ${id}`})
        }

        res.status(200).json({ getById: getById, message: `ID : ${id} | correctement trouvé le produit` });
    } catch (error) {
        res.status(500).json({ error: error.message, message: "Erreur 500 controllers by id produits" });
    }
};

exports.getProduitsNom = async (req,res) => {
    try {
        const nom = req.params.name
        const getNomProduit = await getNomProduits(nom)

        if (!getNomProduit.length > 0){
            return res.status(400).json({message: `Aucun produit est associer à ; ${nom}`})
        }
        res.status(200).json({getNomProduit, message: `Le produit ${nom} à été trouver`})
    } catch (error) {
        res.status(500).json({error: error, message: "Erreur 500 controller par nom produit"})
    }
}

exports.createProducts = async (req, res) => {
    try {
        const champsObligatoire = ['nom', 'prix', 'quantiter'];
        const champsManquants = [];

        for (const champs of champsObligatoire) {
            if (!req.body[champs]) {
                champsManquants.push(champs);
            }
        }

        if (champsManquants.length > 0) {
            return res.status(400).json({ message: `Champs manquants : ${champsManquants.join(', ')}` });
        }
        
        const createInfos = {
            "nom": req.body.nom,
            "prix": parseFloat(req.body.prix), 
            "quantiter": parseInt(req.body.quantiter),  
        };
        
        const createNewProduitId = await createProduct(createInfos);
        res.status(200).json({ createNewProduitId: createNewProduitId, message: `Le produit => ${createInfos.nom} a correctement été créé : ` });
    } catch (error) {
        res.status(500).json({ error: error, message: 'Erreur 500 controllers create produits' });
    }
};


exports.updateProduits = async (req,res) => {
    try {
        const id = parseInt(req.params.id);
        const produitUpdate = req.body;

        const affectedRow = await updateProduit(id, produitUpdate);
        res.status(200).json({affectedRow: affectedRow, message: `Mise à jour du produit : ${produitUpdate.nom} ID: ${id}`})
    } catch (error) {
        res.status(500).json({error: error, message: "Erreur controller update produits :"})
    }
}


exports.deleteProduits = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        // Vérifier si le produit existe avant de le supprimer
        const produitExist = await getProduitId(id);
        if (!produitExist || produitExist.length === 0) {
            return res.status(404).json({ message: `Produit avec l'ID ${id} n'existe pas.` });
        }

        // Supprimer le produit
        const message = await deleteProduit(id);
        res.status(200).json({ message: `Le produit à bien été supprimer` });
    } catch (error) {
        console.error('Erreur dans le contrôleur deleteProduits :', error);
        res.status(500).json({ error, message: 'Erreur lors de la suppression du produit.' });
    }
};
