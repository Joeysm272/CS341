const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const programSchema = new Schema({
    programName: {type: String},
    type: {type: String},
    instructor: {type: String},
    startDate: {type: String},
    endDate: {type: String},
    startTime: {type: String},
    endTime: {type: String},
    availableDays: {
        type: [String],
        enum: ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'],
        default: [] // If nothing is provided, defaults to an empty array
    },
    availableDays: [],
    location: {type: String},
    capacity: {type: Number},
    memberPrice: {type: Number},
    nonMemberPrice: {type: Number},
    desc: {type: String},
    enrolled: {type: Number}
});

module.exports = mongoose.model('programs', programSchema);

