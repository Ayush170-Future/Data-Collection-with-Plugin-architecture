const router = require("express").Router();
const {addResponseToAForm} = require("../controllers/responseControllers");

router.post('/add/:id', addResponseToAForm);

module.exports = router;