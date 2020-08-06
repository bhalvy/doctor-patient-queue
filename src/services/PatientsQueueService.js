'use strict';

const Queue = require('~/src/lib/queue');
const log = require('~/src/lib/logger');

class PatientsQueueService extends Queue {
    constructor() {
        super('patient');
    }

    addDoctorToQueue(item) {
        return super.add(item);
    }

    getNextJob() {
        return super.getNextJob();
    }

}

module.exports = new PatientsQueueService();