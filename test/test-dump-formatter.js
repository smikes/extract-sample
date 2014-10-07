/*global describe, it*/
'use strict';

var assert = require('assert');
var dumpFormatter = require('../lib/dump-formatter');

it('imports the module', function () {
    assert.ok(dumpFormatter);
});

describe('formatted dump', function () {
    // suitable for inclusion in a C/C++ file
    // example format:
    // Extracted from <file> (<modified date>)
    // nn bytes from 0x00001234 to 0x00004567
    // const char * file_offset_length = \ /* 0x00001234 */
    // "$ 00 01 02 03 04 05 06 07 08  09 0A 0B 0C 0D 0E 0F ................." \ // 00-0F
    // "$ 00 01 02 03 04 05 06 07 08  09 0A 0B 0C 0D 0E 0F ................." \ // 10-1F
    // ;

    it('writes a header line', function () {
        assert.equal(dumpFormatter.headerLine({filename: 'cat.exe',
                                               mtime: new Date('Mon 10 Oct 2011 23:24:11 GMT')}),
                     "// Extracted from cat.exe [Mon, 10 Oct 2011 23:24:11 GMT]\n");
    });
});
