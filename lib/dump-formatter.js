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

function c_escape(str) {
    str = str.replace('.', '_');
    return str;
}

function variableDeclaration(file) {
    return "const char * " + c_escape(file.filename) + "_" + sprintf("0x%08X", file.offset) +
        "_" + file.buffer.length + " =\\";
}

function dataHeader(file) {
    return '"Data: DATA ' + file.buffer.length + '\\n"';
}

function bytes8(buffer) {
    var i, a = [], t;

    for (i = 0; i < 8; i += 1) {
        t = buffer.readUInt8(i, true);
        a.push(t === undefined ? "   " : sprintf("%02x ", t));
    }
    return a.join("");
}

function char16(buffer) {
    var i, a = [], t;

    for (i = 0; i < 16; i += 1) {
        t = buffer.readUInt8(i, true);
        if (t === undefined) {
            t = ' '.charCodeAt(0);
        } else if (t < 32 || t > 127) {
            t = '.'.charCodeAt(0);
        }
        a.push(String.fromCharCode(t));
    }
    return a.join("");
}

function dataBodyLine(buffer, offset) {
    var end = (-1) + Math.min(buffer.length, offset + 16);

    return '"$ ' +
        bytes8(buffer.slice(offset)) + " " +
        bytes8(buffer.slice(offset + 8)) + " " +
        char16(buffer.slice(offset, 16)) + '\\n" // ' +
        sprintf("%02X", offset) + '-' + sprintf("%02X", end);
}

function dataBodyLines(file) {
    var i = 0, lines = [];

    for (i = 0; i < file.buffer.length; i += 16) {
        lines.push(dataBodyLine(file.buffer, i));
    }

    return lines;
}

function formatDump(file) {
    var lines = [
        headerLine(file),
        headerLine2(file),
        variableDeclaration(file),
        dataHeader(file)
    ].concat(dataBodyLines(file), ";");

    return lines.join("\n");
}

// public API
module.exports = formatDump;

// testing API
formatDump.headerLine = headerLine;
formatDump.headerLine2 = headerLine2;
formatDump.variableDeclaration = variableDeclaration;
formatDump.dataHeader = dataHeader;
formatDump.dataBodyLine = dataBodyLine;

