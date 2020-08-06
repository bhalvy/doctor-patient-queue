'use strict';
require('../root-module-resolver');
const log = require('loglevel');
const _ = require('lodash');
const chance = require('chance').Chance();
const Mongoose = require('~/src/lib/mongoose');
const uuid = require('uuid');
const mongo = new Mongoose();
const DoctorsDomainService = require('~/src/services/DoctorsDomainService');
const data = [
    {
        'model': 'Doctor',
        documents: [
            // Early Shift
            {
                _id: uuid.v4(),
                name: `Dr. ${chance.name()}`,
                shiftStart: '00:00',
                shiftEnd: '09:00',
            },
            {
                _id: uuid.v4(),
                name: `Dr. ${chance.name()}`,
                shiftStart: '00:00',
                shiftEnd: '09:00',
            },
            {
                _id: uuid.v4(),
                name: `Dr. ${chance.name()}`,
                shiftStart: '00:00',
                shiftEnd: '09:00',
            },
            {
                _id: uuid.v4(),
                name: `Dr. ${chance.name()}`,
                shiftStart: '00:00',
                shiftEnd: '09:00',
            },
            {
                _id: uuid.v4(),
                name: `Dr. ${chance.name()}`,
                shiftStart: '00:00',
                shiftEnd: '09:00',
            },
            {
                _id: uuid.v4(),
                name: `Dr. ${chance.name()}`,
                shiftStart: '00:00',
                shiftEnd: '09:00',
            },
            // Day Shift
            {
                _id: uuid.v4(),
                name: `Dr. ${chance.name()}`,
                shiftStart: '09:00',
                shiftEnd: '18:00',
            },
            {
                _id: uuid.v4(),
                name: `Dr. ${chance.name()}`,
                shiftStart: '09:00',
                shiftEnd: '18:00',
            },
            {
                _id: uuid.v4(),
                name: `Dr. ${chance.name()}`,
                shiftStart: '09:00',
                shiftEnd: '18:00',
            },
            {
                _id: uuid.v4(),
                name: `Dr. ${chance.name()}`,
                shiftStart: '09:00',
                shiftEnd: '18:00',
            },
            {
                _id: uuid.v4(),
                name: `Dr. ${chance.name()}`,
                shiftStart: '09:00',
                shiftEnd: '18:00',
            },
            {
                _id: uuid.v4(),
                name: `Dr. ${chance.name()}`,
                shiftStart: '09:00',
                shiftEnd: '18:00',
            },
            {
                _id: uuid.v4(),
                name: `Dr. ${chance.name()}`,
                shiftStart: '09:00',
                shiftEnd: '18:00',
            },
            {
                _id: uuid.v4(),
                name: `Dr. ${chance.name()}`,
                shiftStart: '09:00',
                shiftEnd: '18:00',
            },
            {
                _id: uuid.v4(),
                name: `Dr. ${chance.name()}`,
                shiftStart: '09:00',
                shiftEnd: '18:00',
            },
            {
                _id: uuid.v4(),
                name: `Dr. ${chance.name()}`,
                shiftStart: '09:00',
                shiftEnd: '18:00',
            },
            // Night Shift
            {
                _id: uuid.v4(),
                name: `Dr. ${chance.name()}`,
                shiftStart: '18:00',
                shiftEnd: '23:59',
            },
            {
                _id: uuid.v4(),
                name: `Dr. ${chance.name()}`,
                shiftStart: '18:00',
                shiftEnd: '23:59',
            },
            {
                _id: uuid.v4(),
                name: `Dr. ${chance.name()}`,
                shiftStart: '18:00',
                shiftEnd: '23:59',
            },
            {
                _id: uuid.v4(),
                name: `Dr. ${chance.name()}`,
                shiftStart: '18:00',
                shiftEnd: '23:59',
            },
            {
                _id: uuid.v4(),
                name: `Dr. ${chance.name()}`,
                shiftStart: '18:00',
                shiftEnd: '23:59',
            },
            {
                _id: uuid.v4(),
                name: `Dr. ${chance.name()}`,
                shiftStart: '18:00',
                shiftEnd: '23:59',
            },
        ]
    }
]

const seeder = require('mongoose-seed');

const db = 'mongodb://localhost:27017/remedy-queue';

return new Promise((resolve, reject) => {
    seeder.connect(db, async function() {
        await seeder.loadModels([
            './src/models/DoctorModel.js'
        ])
        await seeder.clearModels(['Doctor'], async function() {
            await seeder.populateModels(data, (err, done) => {
                if (err) {
                    return console.log('seed err', err)
                }
                if (done) {
                    return console.log('seed done', done);
                }

                resolve(seeder.disconnect());
            });



        });

    })
}).then(() => process.exit())



