const client = require('prom-client'); // Metric collection
const responseTime = require('response-time');
const logger = require('../logger/index.js');

collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({register: client.register});

const reqResTime = new client.Histogram({
    name: "http_express_req_res_time",
    help: "Tells about the delay in req, res cycle",
    labelNames: ['method', 'route', 'status_code'],
    buckets: [1, 50, 100, 200, 400, 500, 800, 1000, 2000]
});

const totalReqCounter = new client.Counter({
    name: "total_req_counter",
    help: "Tells total requests",
});

const totalFormsRequests = new client.Counter({
    name: "total_forms_requests",
    help: "Tells total forms route requests",
});

const totalNumberOfResponses = new client.Counter({
    name: "total_number_of_responses",
    help: "Tells total number of forms responses",
})

const totalNumberOfErrors = new client.Counter({
    name: "total_number_of_errors",
    help: "Tells total numbef of miss-hits in the application: Wrong queries, etc"
})

// Create a Gauge metric for concurrency
const concurrencyGauge = new client.Gauge({
    name: 'concurrency_metric',
    help: 'Number of concurrent requests',
});

logger.info('Metrics collector configured');

module.exports = {client, reqResTime, totalReqCounter, totalFormsRequests, totalNumberOfResponses, totalNumberOfErrors, concurrencyGauge};