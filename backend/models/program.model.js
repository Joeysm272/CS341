const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const programSchema = new Schema({
    programName: {type: String},
    type: {type: String},
    instructor: {type: String},
    time: {type: String},
    location: {type: String},
    capacity: {type: Number},
    memberPrice: {type: Number},
    nonMemberPrice: {type: Number},
    desc: {type: String},
    enrolled: {type: Number}
});

module.exports = mongoose.model('programs', programSchema);

