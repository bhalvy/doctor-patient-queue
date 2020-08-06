'use strict';
const adminAPI = require('~/src/api/adminRoutes');
const doctorAPI = require('~/src/api/doctorRoutes');
const patientAPI = require('~/src/api/patientRoutes');

module.exports = function(app) {
    app.use('/admin', adminAPI);
    app.use('/doctor', doctorAPI);
    app.use('/patient', patientAPI);
};