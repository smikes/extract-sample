// Copyright 2014 Cubane Canada
// Released under MIT license - see LICENSE for details
'use strict';

var fs = require('fs');

function File(name, offset, length, callback) {
    var file = this;

    this.filename = name;
    this.offset = offset;
    this.length = length;
    this.buffer = new Buffer(length);

    file.onOpen = function (err, fd) {
        if (err) {
            return callback(err);
        }

        file.fd = fd;
        fs.fstat(fd, file.onStat);
    };

    file.onStat = function (err, stats) {
        if (err) {
            return callback(err);
        }

        file.mtime = stats.mtime;

        fs.read(file.fd, file.buffer, 0, file.length, file.offset,
                file.onRead);
    };

    this.onRead = function (err, bytesRead, buffer) {
        /*jslint unparam:true*/
        if (err) {
            return callback(err);
        }

        fs.close(file.fd);
        delete file.fd;

        callback(null, file);
    };

    return this;
}

/**
 *
 */
function extract(name, offset, length, callback) {
    var file = new File(name, offset, length, callback);

    fs.open(name, 'r', file.onOpen);
}

// public API
module.exports = extract;

// testing API
extract.File = File;
