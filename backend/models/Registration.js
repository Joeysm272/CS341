// models/Registration.js
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
