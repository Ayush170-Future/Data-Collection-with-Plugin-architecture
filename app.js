require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const errorHandler = require('./middleware/errorHandler.js');
const Plugins = require('./pluginsManager.js');
const EventEmitter = require('events');
const logger = require('./logger/index.js');

class DataCollectionApp extends EventEmitter {
  constructor() {
    super();
    this.server = express();
    this.port = process.env.PORT || 5000;

    this.plugins = new Plugins(this);

    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  setupMiddleware() {
    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: true }));
    logger.info('Middleware configured');
  }

  setupRoutes() {
    this.server.use('/form/', require('./routes/formRoute'));
    this.server.use('/response/', require('./routes/responseRoute'));
    logger.info('Routes configured');
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

["exit", "SIGINT", "SIGUSR1", "SIGUSR2", "SIGTERM", "uncaughtException"].forEach(event => {
    process.on(event, () => global.dataCollectionApp.stop());
});