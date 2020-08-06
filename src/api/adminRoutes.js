const express = require('express');
const adminAPI = express.Router({ path: '/admin' });
const DoctorsQueueService = require('~/src/services/DoctorsQueueService');
const PatientsQueueService = require('~/src/services/PatientsQueueService');

adminAPI.get('/getQueue/:type', async function(req, res, next) {
  const { params } = req;
  let response;
  console.log(params)
  if(params.type === 'doctor'){
    response = await DoctorsQueueService.getJobs();
  } else {
    response = await PatientsQueueService.getJobs();
  }

  return res.json(response).end();

});

adminAPI.get('/clear', async function(req, res, next) {

  await DoctorsQueueService.clearQueue();
  await PatientsQueueService.clearQueue();
  return res.status(204).end();

});

module.exports = adminAPI;
