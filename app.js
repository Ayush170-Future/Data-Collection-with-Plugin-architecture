require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const errorHandler = require('./middleware/errorHandler.js');
const Plugins = require('./pluginsManager.js');
const EventEmitter = require('events');

class DataCollectionApp extends EventEmitter {
  constructor() {
    super();
    this.server = express(); // Change 'app' to 'server'
    this.port = process.env.PORT || 5000;

    this.plugins = new Plugins(this);

    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
    this.connectToDatabase();
    this.startServer();
  }

  setupMiddleware() {
    this.server.use(express.json()); // Change 'app' to 'server'
    this.server.use(express.urlencoded({ extended: true })); // Change 'app' to 'server'
  }

  setupRoutes() {
    this.server.use('/form/', require('./routes/formRoute')); // Change 'app' to 'server'
    this.server.use('/response/', require('./routes/responseRoute')); // Change 'app' to 'server'
  }

  setupErrorHandling() {
    this.server.use(errorHandler); // Change 'app' to 'server'
  }

  connectToDatabase() {
    mongoose
      .connect(process.env.MONGODB_URI)
      .then(() => {
        console.log('Connected to Mongoose');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async startServer() {
    await this.plugins.loadFromConfig();

    this.connection = this.server.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }

  async stop() {

    // TODO: Shutting down the Express connection

    // Shutting down the MongoDB connection
    await mongoose.disconnect();
    console.log('Server and MongoDB connection stopped');
  }
}

const dataCollectionApp = new DataCollectionApp();
global.dataCollectionApp = dataCollectionApp;