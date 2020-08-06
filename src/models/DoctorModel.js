const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uuid = require('uuid');

const DoctorSchema = new Schema({
    _id: { type: String, default: uuid.v4() },
    date: { type: Date, default: Date.now },
    name: { type: String, required: true },
    onShift: { type: Boolean, default: false },
    shiftStart: { type: String, required: false },
    shiftEnd: { type: String, required: false },
});

module.exports = mongoose.model('Doctor', DoctorSchema);
