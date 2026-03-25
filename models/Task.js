const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    index: true 
  },

  clientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    ref: 'Client'
  },

  clientName: { 
    type: String, 
    required: true 
  },

  address: { 
    type: String 
  },

  description: { 
    type: String 
  },

  date: { 
    type: String, // puedes cambiar a Date si quieres mejorar esto
    required: true 
  },

  time: { 
    type: String 
  },

  images: {
    type: [String], // array de URLs (Cloudinary)
    default: [],
  },

  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed'],
    default: 'pending'
  }

}, {
  timestamps: true,
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform: (_doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      return ret;
    }
  },
  toObject: {
    virtuals: true,
    transform: (_doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      return ret;
    }
  }
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;