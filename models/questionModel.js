const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
    trim: true,
  },
  required: {
    type: Boolean,
    default: false,
  },
  formId: {
    type: mongoose.Schema.Types.ObjectId,    // In Future we might have a use-case where we want to fetch question based upon FormID
    ref: 'Form',                             // Little optimization in speed wrt increase in redundency
  },
}, {
    timestamp: true,
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;