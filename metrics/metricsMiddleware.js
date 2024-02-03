const { client, reqResTime, totalReqCounter, totalFormsRequests, totalNumberOfResponses, totalNumberOfErrors, concurrencyGauge } = require('./metric');
const responseTime = require('response-time');

// Middleware to measure response time
const responseTimeMiddleware = responseTime((req, res, time) => {
    totalReqCounter.inc();
    reqResTime.labels({
        method: req.method,
        route: req.originalUrl,
        status_code: res.statusCode,
    }).observe(time);
});

// Middleware to count total forms route requests
const totalFormsRequestsMiddleware = (req, res, next) => {
    totalFormsRequests.inc();
    next();
};

// Middleware to count total number of forms responses
const totalNumberOfResponsesMiddleware = (req, res, next) => {
    totalNumberOfResponses.inc();
    next();
};

// Middleware to count total number of errors
const totalNumberOfErrorsMiddleware = (req, res, next) => {
    totalNumberOfErrors.inc();
    next();
};

// Middleware to update concurrency metric
const concurrencyMiddleware = (req, res, next) => {
    concurrencyGauge.inc();
    res.on('finish', () => {
        concurrencyGauge.dec();
    });
    next();
};

module.exports = {
    responseTimeMiddleware,
    totalFormsRequestsMiddleware,
    totalNumberOfResponsesMiddleware,
    totalNumberOfErrorsMiddleware,
    concurrencyMiddleware,
};
