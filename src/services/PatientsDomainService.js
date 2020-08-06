'use strict';

const _ = require('lodash');
const chance = require('chance').Chance();

const log = require('~/src/lib/logger');
const Mongoose = require('~/src/lib/mongoose');
const PatientModel = require('~/src/models/PatientModel');

class PatientsDomainService extends Mongoose {
    constructor() {
        super(PatientModel);
    };

    /**
     * This method is mocking a patient database decoupled from this module.
     * When we 'get' a patient- we create a new one if one doesn't exist already.
     *
     * @param id
     * @returns {*}
     */
    async getById(id)   {
        let createIfMissing;

        createIfMissing = await super.getById(id)

        if(_.isNull(createIfMissing)) {
            const payload = {
                _id: id,
                name: `${chance.name()}`,
            };
            createIfMissing = await super.create(payload);
        }

        return createIfMissing;

    }
}

module.exports = new PatientsDomainService();