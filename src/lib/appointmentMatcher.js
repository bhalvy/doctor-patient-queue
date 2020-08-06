'use strict';
const _ = require('lodash');
const log = require('loglevel');
const { v4 } = require('uuid');
const chance = require('chance').Chance();

const AppointmentService = require('~/src/services/AppointmentService');
const DoctorsQueueService = require('~/src/services/DoctorsQueueService');
const PatientsDomainService = require('~/src/services/PatientsDomainService');
const PatientsQueueService = require('~/src/services/PatientsQueueService');

const appointments = [];

async function initializeMatcher(socket) {

    /**
     * Listen for New Socket Connections from Patients
     * - Initialize New Appointment
     * - Add Patient to Queue
     *
     */
    await socket.on('connect', async socket => {
        const Appointment = await new AppointmentService(socket);
        await Appointment.initConnection();

        appointments.push(Appointment);

        log.info(`Queue length is ${appointments.length}`)
    });

    /**
     * Listen for New Doctors Added to the Queue
     * - Pull Job From Queue
     * - Send to Call
     *
     */
    DoctorsQueueService.queue.on('waiting', async function(jobId, progress) {

        const availableDoctor = await DoctorsQueueService.getJob(jobId);
        log.info(`${availableDoctor.data.name} is currently waiting.`);

        await processCall(availableDoctor);

    });

    /**
     * Mock WebRTC Connection
     * - Get Next Patient
     * - Either Mock Video Chat or Retry Job
     *
     * @param availableDoctor
     */
    async function processCall(availableDoctor) {
        const waitingPatient = await PatientsQueueService.getNextJob();
        if (!waitingPatient) {
            log.warn('No Waiting Patients');
            await availableDoctor.moveToFailed('No Patients', true, true);
            await availableDoctor.retry();
            return;
        }

        const [Appointment] = _.remove(appointments, ['patientId', waitingPatient.data._id]);

        try {
            if(!Appointment) throw Error(`Socket For ${waitingPatient.data._id} No Longer Available`);

            await availableDoctor.progress(50);
            await Appointment.connectToDoctor(availableDoctor);
            await Appointment.startCall();
            await Appointment.releaseDoctor(availableDoctor.data);

        } catch(error) {
            log.warn(error.message);

            await availableDoctor.moveToFailed('Socket No Longer Available', true, true);
            await waitingPatient.moveToFailed('Socket No Longer Available', true, true);
            await waitingPatient.discard();
            await availableDoctor.retry();

        }

    }
}

/**
 * Send Doctors to Work
 *
 * @returns {Promise<*>}
 */
async function addDoctorToQueue(doctor) {
    return DoctorsQueueService.addDoctorToQueue(doctor);
}

/**
 * NOT IMPLEMENTED *
 * Remove Doctor from Queue
 *
 * @returns {Promise<void>}
 */
async function removeDoctorFromQueue(doctor) {
    return DoctorsQueueService.removeFromQueue(doctor)
}

/**
 * Fake A Patient For Testing
 *
 * @returns {Promise<void>}
 */
async function addFakePatient() {
    const socket = {
        id: 'FAKE SOCKET'
    };

    const patient = {
        _id: v4(),
        name: `${chance.name()}`,
    };

    await PatientsDomainService.create(patient);
    const Appointment = await new AppointmentService(socket, true);
    await Appointment.initConnection(patient._id);

    appointments.push(Appointment);

}

module.exports = {
    initializeMatcher,
    addDoctorToQueue,
    removeDoctorFromQueue,
    addFakePatient,
};