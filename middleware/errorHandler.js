const logger = require('../logger/index.js');
const {totalNumberOfErrors} = require('../metrics/metric.js');

const errorHandler = (err, req, res, next) => {
    logger.info("Inside Error Handler");
    totalNumberOfErrors.inc();
    const statusCode = res.statusCode ? res.statusCode : 500;

    logger.error(err.message);
    logger.error(err.stack);

    switch(statusCode) {
        case 400:
            res.status(400).json({
                title: "Bad Request",
                message: err.message,
                stackTrace: err.stack,
            });
            break;
        case 500:
        default:
            console.error("Unhandled error:", err);
            res.status(500).json({
                title: "Internal Server Error",
                message: "Something went wrong!",
                stackTrace: err.stack,
            });
            break;
    }
};

module.exports = errorHandler;