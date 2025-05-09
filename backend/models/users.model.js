//Users model
// This file defines the schema for users in the database using Mongoose.
// It includes fields for first name, last name, username, password, email, phone number, role, family members, and active status.
//Author: Joey Smith
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const familyMemberSchema = new mongoose.Schema({
    firstName: { type: String },
    lastName: {type: String },
    relationship: { type: String } 
  });

const userSchema = new Schema({
    firstName: {
        type: String,
        // required: true,
    },
    lastName: {
        type: String,
        // required: true
    },
    username: {
        type: String,
        // required: true
    },
    password: {
        type: String,
        // required: true
    },
    email: {
        type: String,
        // required: true
    },
    phone: {type: String,
            match: [/^\+?[0-9\- ]+$/, "Invalid phone number format"] //Ensures phone number is valid
    },
    role: {
        type: String,
        enum: ['member','staff'],
        default: 'member'
    },

    family:[familyMemberSchema],

    active: {
        type: Boolean,
        default: true
      }
});

module.exports = mongoose.model('users', userSchema);

