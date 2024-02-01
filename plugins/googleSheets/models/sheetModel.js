const mongoose = require('mongoose');

const sheetSchema = new mongoose.Schema({
  sheetId: {
    type: String,
    required: true,
    trim: true,
  },
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
    index: { unique: true }
  }
}, {
    timestamp: true,
});

const Sheet = mongoose.model('Sheet', sheetSchema);

module.exports = Sheet;