const productionLogger = require('./productionLogger')

let logger = null;
logger = productionLogger()
logger.info("Logging Started!")

if (process.env.NODE_ENV === "production") {
    logger = productionLogger()
}

module.exports = logger;