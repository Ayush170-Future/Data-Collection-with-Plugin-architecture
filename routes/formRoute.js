const router = require("express").Router();
const {createForm, addQuestions, createFormEventEmitter} = require("../controllers/formControllers");

router.post('/create', createForm, createFormEventEmitter);
router.post('/addQuestions/:id', addQuestions);

module.exports = router;