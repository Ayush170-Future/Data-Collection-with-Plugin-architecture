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
    this.connectToDatabase();
    this.startServer();
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

  connectToDatabase() {
    mongoose
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
    // TODO: Shutting down the Express connection
    logger.info('Stopping the server...');

    // Shutting down the MongoDB connection
    await mongoose.disconnect();
    logger.info('Server and MongoDB connection stopped');
  }
}

const dataCollectionApp = new DataCollectionApp();
global.dataCollectionApp = dataCollectionApp;
logger.info('DataCollectionApp initialized');