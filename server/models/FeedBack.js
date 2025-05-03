const mongoose = require('mongoose');

const feedback = new mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, default: ''},
  message: { type: String, required: true },
});

feedback.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('feedback', feedback);
