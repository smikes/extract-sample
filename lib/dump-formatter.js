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
    return '"Data: DATA ' + file.buffer.length + '"';
}

function dataBodyLine(buffer, offset) {
    return '"$ ';
}


exports.headerLine = headerLine;
exports.headerLine2 = headerLine2;
exports.variableDeclaration = variableDeclaration;
exports.dataHeader = dataHeader;
exports.dataBodyLine = dataBodyLine;

