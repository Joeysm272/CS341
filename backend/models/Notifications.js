//Notifications model
// This file defines the schema for notifications in the database using Mongoose.
// It includes fields for user ID, message, date, and read status.
//Author: Joey Smith
const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  read: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Notification', NotificationSchema);
