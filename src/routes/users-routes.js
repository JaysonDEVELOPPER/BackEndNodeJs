const router = require("express").Router() // permet de definir les routes suivant qui seront appeler
const {getAll,getByNames, getByIds,createUsers,updateUsers,loginUser, deleteUsers} = require("../controllers/users-controllers") // router pour les allez chercher la function definis

router.get("/", getAll)
router.get("/bynom/:nom", getByNames)
router.get("/byid/:id", getByIds)
router.post('/', createUsers)
router.put('/:id', updateUsers)
router.post('/login', loginUser)
router.delete('/:id', deleteUsers)

module.exports = router; // exportes les router