const router = require("express").Router();
const {getAll,getProduitsId,getProduitsNom,createProducts,updateProduits,deleteProduits} = require("../controllers/produits-controllers")

router.get("/", getAll)
router.get('/byid/:id', getProduitsId)
router.get('/bynom/:name', getProduitsNom)
router.post('/', createProducts)
router.put('/:id', updateProduits)
router.delete('/:id', deleteProduits)

module.exports = router;
