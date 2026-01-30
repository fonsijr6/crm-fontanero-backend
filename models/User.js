const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['owner','helper'], default: 'owner' }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;