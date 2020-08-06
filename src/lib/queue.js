'use strict';

const Bull = require('bull');

class Queue {
    constructor(name) {
        this.queue = new Bull(
            name,
            'redis://127.0.0.1:6379', {
            limiter: {
                max: 10000,
                duration: 1000000,
                bounceBack: true // important
            },
        });
        this.name = name;
    }

    add(item, opts = {}) {
        return this.queue.add(this.name, item, opts);
    }

    getJobs() {
        return this.queue.getJobs();
    }

    getJob(id) {
        return this.queue.getJob(id);
    }

    getNextJob() {
        return this.queue.getNextJob(this.name);
    }

    async clearQueue() {
        await this.queue.clean(1000, 'delayed');
        await this.queue.clean(1000, 'completed');
        await this.queue.clean(1000, 'wait');
        await this.queue.clean(1000, 'failed');
        await this.queue.clean(1000, 'active');
        return this.queue.empty();

    }
}

module.exports = Queue;