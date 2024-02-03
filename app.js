require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const errorHandler = require('./middleware/errorHandler.js');
const Plugins = require('./pluginsManager.js');
const EventEmitter = require('events');
const logger = require('./logger/index.js');
const responseTime = require('response-time');
const { client } = require('./metrics/metric.js');
const {responseTimeMiddleware, concurrencyMiddleware} = require('./metrics/metricsMiddleware.js');

class DataCollectionApp extends EventEmitter {
  constructor() {
    super();
    this.server = express();
    this.port = process.env.PORT || 5000;

    this.plugins = new Plugins(this);

    this.setupMiddleware();
    this.setupMetricsMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
    this.setupMetricCollectionRoute();
  }

  setupMiddleware() {
    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: true }));
    logger.info('Middleware configured');
  }

  setupMetricsMiddleware() {
    this.server.use(responseTimeMiddleware);
    this.server.use(concurrencyMiddleware);
    logger.info('Metrics Middleware configured');
  }

  setupRoutes() {
    // General Route
    this.server.get('/', (req, res) => {
        res.send('Welcome to the most Failsafe, Scalable and Modular Data collection Backend ever!');
    });

    // Form routes
    this.server.use('/form/', require('./routes/formRoute'));
    this.server.use('/response/', require('./routes/responseRoute'));
    logger.info('Routes configured');
  }

  setupMetricCollectionRoute() {
    this.server.get("/metrics", async (req, res) => {
        res.setHeader("Content-Type", client.register.contentType);
        const metrics = await client.register.metrics();
        res.send(metrics);
    });
    logger.info('Metrics Collection routes configured');
  }

  setupErrorHandling() {
    this.server.use(errorHandler);
    logger.info('Error handling set up');
  }

  async connectToDatabase() {
    await mongoose
      .connect(process.env.MONGODB_URI)
      .then(() => {
        logger.info('Connected to Mongoose');
      })
      .catch((err) => {
        logger.error(`MongoDB connection error: ${err}`);
      });
  }

  async startServer() {
    await this.plugins.loadFromConfig();

    this.connection = this.server.listen(this.port, () => {
      logger.info(`Server running on port ${this.port}`);
    });
  }

  async stop() {
    logger.info('Stopping the server...');
    this.connection.close(() => {
        logger.info('Stopping the express connection...');
    })

    // Shutting down the MongoDB connection
    await mongoose.disconnect();
    logger.info('Server and MongoDB connection stopped');
  }
}

async function startApp() {
    const dataCollectionApp = new DataCollectionApp();
    logger.info('DataCollectionApp initialized');
    await dataCollectionApp.connectToDatabase();
    await dataCollectionApp.startServer();
    global.dataCollectionApp = dataCollectionApp;
}

startApp();

["exit", "SIGINT", "SIGUSR1", "SIGUSR2", "SIGTERM"].forEach(event => {
    process.on(event, () => global.dataCollectionApp.stop());
});