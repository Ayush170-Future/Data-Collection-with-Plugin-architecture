const router = require("express").Router();
const {createForm, addQuestions, createFormEventEmitter, addQuestionsEventEmitter} = require("../controllers/formControllers");

router.post('/create', createForm, createFormEventEmitter);
router.post('/addQuestions/:id', addQuestions, addQuestionsEventEmitter);

module.exports = router;