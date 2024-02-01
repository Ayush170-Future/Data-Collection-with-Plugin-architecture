require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const errorHandler = require('./middleware/errorHandler.js');

class DataCollectionApp {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 5000;

    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
    this.connectToDatabase();
    this.startServer();
  }

  setupMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  setupRoutes() {
    this.app.use('/form/', require('./routes/formRoute'));
    this.app.use('/response/', require('./routes/responseRoute'));
  }

  setupErrorHandling() {
    this.app.use(errorHandler);
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

  startServer() {
    this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}

// Starting the main application
const dataCollectionApp = new DataCollectionApp();