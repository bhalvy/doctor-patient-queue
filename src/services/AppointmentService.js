'use strict';

const _ = require('lodash');
const log = require('loglevel');
const interval = require('interval-promise');
const { v4 } = require('uuid');

const PatientsDomainService = require('~/src/services/PatientsDomainService');
const DoctorsQueueService = require('~/src/services/DoctorsQueueService');
const PatientsQueueService = require('~/src/services/PatientsQueueService');
const DoctorsDomainService = require('~/src/services/DoctorsDomainService');

const StatusType = Object.freeze({
    WAITING: 'waiting',
    ACTIVE: 'active',
    COMPLETED: 'completed',
});

/**
 * Appointment Service Class
 * - Holds Patient Socket
 * - Holds State for Each Individual 'call'
 * - Manages Queue Job Lifecycle
 *
 */
class AppointmentService {
    constructor(socket, mocked = false) {
        this.socket = socket;
        this.status = StatusType.WAITING;
        this.patientId = null;
        this.patient = {};
        this.patientJob = null;
        this.doctorId = '';
        this.doctor = {};
        this.doctorJob = null;
        this.mocked = mocked
    }

    /**
     * Get Data From UI To Hydrate the Patient Attribute
     *
     * @param patientId - default:null -- overrides the socket event
     * @returns {Promise<unknown>}
     */
    async initConnection(patientId = null) {
        return new Promise(async (resolve, reject) => {
            this.status = StatusType.WAITING;

            if (!_.isNull(patientId) && !!this.mocked) {
                this.patient = await PatientsDomainService.getById(patientId);
                this.patientId = patientId;
                this.patientJob = await PatientsQueueService.add({ _id: this.patientId });
                log.info(`New Connection Request From ${this.patient.name}`);

                resolve();

            } else {
                this.socket.on('init', async data => {
                    this.patient = await PatientsDomainService.getById(data.patientId);
                    this.patientId = data.patientId;
                    this.patientJob = await PatientsQueueService.add({ _id: this.patientId });
                    log.info(`New Connection Request From ${this.patient.name}`);

                    resolve()
                });
            }


        });
    };

    /**
     * Get Available Doctor to Initialize Call
     *
     * @param availableDoctor
     * @param patientJob
     * @returns {Promise<unknown>}
     */
    async connectToDoctor(availableDoctor, patientJob = null) {
        return new Promise(async (resolve, reject) => {
            this.status = StatusType.ACTIVE;

            if (patientJob !== null) {
                this.patientJob = patientJob;
            }

            this.doctorJob = availableDoctor;
            this.doctorId = _.get(availableDoctor, 'data._id');

            const doctor = await DoctorsDomainService.getById(_.get(availableDoctor, 'data._id'));
            this.doctor = doctor;

            resolve();
        })
    }

    /**
     * Mocks the Time for a Patient/Doctor Consultation
     *
     * @returns {Promise<void>}
     */
    async startCall() {
        log.info(`CONNECTING THE CALL BETWEEN ${this.patient.name}:${this.patientJob.id} and ${this.doctor.name}:${this.doctorJob.id}`);
        const lengthOfCall = Math.floor(Math.random() * 100) * 2000;

        if(!this.mocked) {
            this.socket.emit('call-connected', {
                doctorId: this.doctorId,
            });
        }

        await interval(async () => {
            // CALL TIME
        }, lengthOfCall, { iterations: 1 });

        return this.endCall();
    }

    /**
     * End the Call and Move the Queue Job to Completed
     *
     * @returns {Promise<void>}
     */
    async endCall() {
        log.info(`ENDING THE CALL BETWEEN ${this.patient.name}:${this.patientJob.id} and ${this.doctor.name}:${this.doctorJob.id}`);

        this.status = StatusType.COMPLETED;

        if (!!this.doctorJob) {
            await this.doctorJob.moveToCompleted("succeeded", true, false);
            await this.doctorJob.finished();
        }

        if (!!this.patientJob) {
            await this.patientJob.moveToCompleted("succeeded", true, false);
            await this.patientJob.finished();
        }
    }

    /**
     * Release Doctor For New Patients
     *
     * @param data
     * @returns {Promise<*>}
     */
    async releaseDoctor(data) {
        return DoctorsQueueService.addDoctorToQueue(data);
    }

}

module.exports = AppointmentService;