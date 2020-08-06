'use strict';
const io = require('socket.io');
const DoctorsQueueService = require('~/src/services/DoctorsQueueService');
const PatientsQueueService = require('~/src/services/PatientsQueueService');

module.exports = async function initializeSockets(server) {

    const socket = await io.listen(server).set('origins', '*:*');
    await DoctorsQueueService.clearQueue();
    await PatientsQueueService.clearQueue();

    return socket;
};


