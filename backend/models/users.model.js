const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const familyMemberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    relation: { type: String, required: true } 
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
            match: [/^\+?[0-9\- ]+$/, "Invalid phone number format"]
    },
    family:[familyMemberSchema],
});

module.exports = mongoose.model('users', userSchema);

