'use strict';

const mongoose = require('mongoose');

class Mongoose {
    constructor(model) {
        this.model = model;

        this.connect();
    }

    connect() {
        return mongoose.connect('mongodb://localhost:27017/remedy-queue', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    }

    create(payload) {
        return this.model(payload).save();
    }

    getAll() {
        return this.model.find();
    }

    getById(id) {
        return this.model.findById(id);
    }

    find(filter) {
        return this.model.find(filter).exec();
    }

    findByIdAndUpdate(id, update) {
        return this.model.findByIdAndUpdate(id, update, { returnOriginal: false, useFindAndModify: false });
    }

    remove(id) {
        return this.model.deleteOne(id);
    }
}

module.exports = Mongoose;