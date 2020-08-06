const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { v4 } = require('uuid');

const PatientSchema = new Schema({
    _id: { type: String, default: v4() },
    date: { type: Date, default: Date.now },
    name: { type: String, required: true },
});

module.exports = mongoose.model('Patient', PatientSchema);