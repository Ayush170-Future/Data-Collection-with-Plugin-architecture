const router = require("express").Router();
const {addResponseToAForm, responseEventEmitter} = require("../controllers/responseControllers");

router.post('/add/:id', addResponseToAForm, responseEventEmitter);

module.exports = router;