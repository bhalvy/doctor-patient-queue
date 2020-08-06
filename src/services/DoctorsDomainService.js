'use strict';
const Mongoose = require('~/src/lib/mongoose');
const log = require('loglevel');
const { format } = require('date-fns');

const DoctorModel = require('~/src/models/DoctorModel');

class DoctorsDomainService extends Mongoose {
    constructor() {
        super(DoctorModel);
    };

    /**
     * Return Doctors that are ready to Start Work.
     *
     * @param currentTime -- String ex. "00:00"
     */
    async getDoctorsForStartOfShift(currentTime) {
        return super.find({
            "onShift": false,
            shiftStart: { $lte: currentTime },
            shiftEnd: { $gte: currentTime },
        });
    };

    /**
     * * NOT IMPLEMENTED * *
     * Return Doctors Ready to End Shift
     *
     * @param currentTime
     * @returns {Promise<*>}
     */
    async getDoctorsForEndOfShift(currentTime) {
        return super.find({
            "onShift": true,
            shiftStart: { $lte: currentTime },
            shiftEnd: { $lte: currentTime },
        })
    }

};

module.exports = new DoctorsDomainService();