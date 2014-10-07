// Copyright 2014 Cubane Canada 
// Released under MIT license - see LICENSE for details
'use strict';

var sprintf = require('sprintf-js').sprintf;

function headerLine(file) {
    return "// Extracted from " + file.filename + " [" + file.mtime.toUTCString() + "]";
}

function headerLine2(file) {
    var start = file.offset,
        end = start + file.buffer.length;
    return "// " + file.buffer.length + " bytes from " + sprintf("0x%08X", start) + " to " +
        sprintf("0x%08X", end);
}


exports.headerLine = headerLine;
exports.headerLine2 = headerLine2;
