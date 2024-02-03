const router = require("express").Router();
const {createForm, addQuestions, createFormEventEmitter, addQuestionsEventEmitter} = require("../controllers/formControllers");
const {totalFormsRequestsMiddleware} = require('../metrics/metricsMiddleware.js');

router.use(totalFormsRequestsMiddleware);
router.post('/create', createForm, createFormEventEmitter);
router.post('/addQuestions/:id', addQuestions, addQuestionsEventEmitter);

module.exports = router;