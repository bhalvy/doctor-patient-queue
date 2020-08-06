'use strict';
const _ = require('lodash');
const log = require('loglevel');
const patientAPI = require('express').Router({ path: '/patient' });
const appointmentMatcher = require('~/src/lib/appointmentMatcher');

/**
 * Adds Multiple Mocked Patients based on :count param
 *
 */
patientAPI.get('/:count', async (req, res, next) => {

    await Promise.all(_.times(req.params.count, async () => {
        await appointmentMatcher.addFakePatient();
    }));
    return res.status(204).end();

});

module.exports = patientAPI;
