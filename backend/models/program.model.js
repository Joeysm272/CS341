const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const programSchema = new Schema({
    programName: {type: String},
    time: {type: String},
    location: {type: String},
    capacity: {type: Number},
    price: {type: Number},
    desc: {type: String}
});

module.exports = mongoose.model('programs', programSchema);

