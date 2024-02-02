const client = require('prom-client'); // Metric collection
const responseTime = require('response-time');
const logger = require('./logger/index.js');

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

logger.info('Metrics collector configured');

module.exports = {client, reqResTime, totalReqCounter};