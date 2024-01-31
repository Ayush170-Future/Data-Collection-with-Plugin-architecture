const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
  },
  responseText: {
    type: String,
    trim: true
  }
}, {
    timestamp: true,
});

const Response = mongoose.model('Response', responseSchema);

module.exports = Response;