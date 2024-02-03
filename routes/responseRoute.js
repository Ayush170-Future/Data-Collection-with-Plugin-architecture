const router = require("express").Router();
const {addResponseToAForm, responseEventEmitter} = require("../controllers/responseControllers");
const {totalNumberOfResponsesMiddleware} = require('../metrics/metricsMiddleware.js');

router.use(totalNumberOfResponsesMiddleware);
router.post('/add/:id', addResponseToAForm, responseEventEmitter);

module.exports = router;