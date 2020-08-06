'use strict';

const Module = require('module');
const path = require('path');

/* eslint-disable process-cwd/no-process-cwd-in-require */
const projectRoot = `${process.cwd()}`;

const _resolveFilename = Module._resolveFilename;

Module._resolveFilename = function (request, parent) {

    if (request.indexOf('~/') === 0) {
        const filename = path.join(projectRoot, request.slice(2));
        return _resolveFilename.call(this, filename, parent);
    }

    return _resolveFilename.apply(this, arguments);
};
