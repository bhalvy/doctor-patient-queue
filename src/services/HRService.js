'use strict';
const _ = require('lodash');
const log = require('loglevel');
const { format } = require('date-fns');

const DoctorsDomainService = require('~/src/services/DoctorsDomainService');
const { addDoctorToQueue, removeFromQueue } = require('~/src/lib/appointmentMatcher');

/**
 * Finds Doctors who are Ready to Work and Sends them to Queue
 *
 * @returns {Promise<[Job, Job, ...]>}
 */
async function goToWork() {
    const currentTime = format(new Date, "HH:mm");
    const doctors = await DoctorsDomainService.getDoctorsForStartOfShift(currentTime);

    return Promise.all(_.map(doctors, async (doctor) => {
        try{
            const ret = await DoctorsDomainService.findByIdAndUpdate({ _id: doctor._id }, { onShift: true });
            log.info(`New Doctor ${ret.name} On The Clock -- TIME: ${currentTime}`);
        } catch (error) {
            log.error(error)
        }

        return addDoctorToQueue(doctor);
    }))

}

/**
 * Finds Doctors with a finished shift and removes them from Queue
 *
 * @returns {Promise<[Job, Job, ...]>}
 */
async function leaveWork() {
    const currentTime = format(new Date, "HH:mm");
    log.info(`Doctors Shift Ending -- TIME: ${currentTime}`);

    const doctors = await DoctorsDomainService.getDoctorsForEndOfShift(currentTime);
    return Promise.all(_.map(doctors, async (doctor) => {
        await DoctorsDomainService.findByIdAndUpdate({ _id: doctor._id }, { onShift: true });
        return removeFromQueue(doctor);
    }))

}

module.exports = {
    goToWork,
    leaveWork,
}