'use strict';
const log = require('loglevel');
const doctorAPI = require('express').Router({ path: '/doctor' });

const DoctorsDomainService = require('~/src/services/DoctorsDomainService');
const DoctorsQueueService = require('~/src/services/DoctorsQueueService');
const { goToWork } = require('~/src/services/HRService');

doctorAPI.get('/', async function(req, res, next) {

  const response = await DoctorsDomainService.getAll();
  return res.json(response).end();

});

doctorAPI.post('/create', async function(req, res, next) {
  const { body } = req;

  const response = await DoctorsDomainService.create(body);
  return res.json(response).end();

});

module.exports = doctorAPI;
