const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  accountId: { type: String, required: true, unique: true }, // Wallet address
  name: { type: String, default: '' },
  bio: { type: String, default: '' },
  avatarUrl: { type: String, default: '' },
  isCreator: { type: Boolean, default: false },
  socials: {
    twitter: { type: String, default: '' },
    instagram: { type: String, default: '' },
    website: { type: String, default: '' },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

userProfileSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('users', userProfileSchema);
