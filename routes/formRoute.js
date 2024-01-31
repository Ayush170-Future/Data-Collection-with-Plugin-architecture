const router = require("express").Router();
const {createForm, addQuestions} = require("../controllers/formControllers");

router.post('/create', createForm);
router.post('/addQuestions/:id', addQuestions);

module.exports = router;