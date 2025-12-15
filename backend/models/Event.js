const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Event name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Event description is required']
  },
  category: {
    type: String,
    enum: ['Heavy', 'Track', 'Field', 'Piping', 'Dancing'],
    required: [true, 'Event category is required']
  },
  maxCompetitors: {
    type: Number,
    default: 20
  },
  currentCompetitors: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Open', 'Full', 'In Progress', 'Completed'],
    default: 'Open'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);