// Copyright 2014 Cubane Canada 
// Released under MIT license - see LICENSE for details
'use strict';

function headerLine(file) {
    return "// Extracted from " + file.filename + " [" + file.mtime.toUTCString() + "]\n";
}

exports.headerLine = headerLine;
