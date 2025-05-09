//Program model for the database
// This file defines the schema for programs in the database using Mongoose.
// It includes fields for program name, type, instructor, dates, times, available days, location, capacity, prices, description, enrolled count, and cancellation status.
//Author: Joey Smith
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const programSchema = new Schema({
  programName: { type: String, required: true },
  type: { type: String, required: true },
  instructor: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  availableDays: {
    type: [String],
    enum: ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'],
    default: [] // Defaults to empty array if nothing provided
  },
  location: { type: String, required: true },
  capacity: { type: Number, required: true },
  memberPrice: { type: Number, required: true },
  nonMemberPrice: { type: Number, required: true },
  desc: { type: String },
  enrolled: { type: Number, default: 0 },
  cancelled: { type: Boolean, default: false }
});

module.exports = mongoose.model('programs', programSchema);
