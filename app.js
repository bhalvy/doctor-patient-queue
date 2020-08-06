require('./root-module-resolver');

const express = require('express');
const appConfig = require('~/src/app.config.js');

const app = express();
appConfig(app);

module.exports = app;
