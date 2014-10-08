// Copyright 2014 Cubane Canada
// Released under MIT license - see LICENSE for details
'use strict';

var fs = require('fs');

function extract(name, offset, length, callback) {
    var file = {
        filename: name,
        offset: offset,
        length: length,
        buffer: new Buffer(length)
    };

    fs.open(name, 'r', function (err, fd) {
        if (err) {
            return callback(err);
        }

        fs.fstat(fd, function (err, stats) {
            if (err) {
                return callback(err);
            }

            file.mtime = stats.mtime;

            fs.read(fd, file.buffer, 0, file.length, file.offset, function (err, bytesRead, buffer) {
                /*jslint unparam:true*/
                if (err) {
                    return callback(err);
                }

                callback(null, file);
            });
        });

    });
}

module.exports = extract;
