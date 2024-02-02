const productionLogger = require('./productionLogger')

let logger = null;
logger = productionLogger()
logger.info("Logging Started!")

module.exports = logger;