'use strict';

const Queue = require('~/src/lib/queue');

class DoctorsQueueService extends Queue {
    constructor() {
        super('doctor');
    }

    addDoctorToQueue(item) {
        return super.add(item);
    }

    getNextJob() {
        return super.getNextJob();
    }

}

module.exports = new DoctorsQueueService();