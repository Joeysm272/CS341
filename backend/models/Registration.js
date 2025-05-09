//Registration model for storing user registrations to programs
// This file defines the schema for registrations in the database using Mongoose.
// It includes fields for member ID, program ID, and registration date.
//Author: Joey Smith
const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema({
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',  // Referencing the exported User model (as "users")
    required: true,
  },
  programId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'programs',  // Referencing the exported Program model (as "programs")
    required: true,
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Registration', RegistrationSchema);
