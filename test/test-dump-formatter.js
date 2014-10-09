/*global describe, it*/
'use strict';

var assert = require('assert');
var dumpFormatter = require('../lib/dump-formatter');

it('imports the module', function () {
    assert.ok(dumpFormatter);
});

describe('formatted dump', function () {
    // suitable for inclusion in a C/C++ file

    var fixture = {
        filename: 'cat.exe',
        mtime: new Date('Mon 10 Oct 2011 23:24:11 GMT'),
        offset: 1234,
        buffer: new Buffer(37)
    };

    // Extracted from <file> (<modified date>)
    it('formats a header line', function () {
        assert.equal(dumpFormatter.headerLine(fixture),
                     "// Extracted from cat.exe [Mon, 10 Oct 2011 23:24:11 GMT]");
    });

    // nn bytes from 0x00001234 to 0x00004567
    it('formats a second header line', function () {
        assert.equal(dumpFormatter.headerLine2(fixture),
                     "// 37 bytes from 0x000004D2 to 0x000004F7");
    });

    // const char * file_offset_length = \
    it('formats a variable declaration', function () {
        assert.equal(dumpFormatter.variableDeclaration(fixture),
                     "const char * cat_exe_0x000004D2_37 =\\");
    });

    it('writes a DATA header line', function () {
        assert.equal(dumpFormatter.dataHeader(fixture),
                     '"Data: DATA 37\\n"');
    });

    describe('data body line', function () {

        it('formats a complete DATA body line', function () {
            var b = new Buffer(16);

            b.fill(0);

            assert.equal(dumpFormatter.dataBodyLine(b, 0),
                         '"$ 00 00 00 00 00 00 00 00  00 00 00 00 00 00 00 00  ................\\n" // 00-0F');
        });

        it('formats a one-byte DATA body line', function () {
            var b = new Buffer(1);

            b.fill(0);

            assert.equal(dumpFormatter.dataBodyLine(b, 0),
                         '"$ 00                                                .               \\n" // 00-00');
        });

        it('formats a eight-byte DATA body line', function () {
            var b = new Buffer(8);

            b.fill(1);

            assert.equal(dumpFormatter.dataBodyLine(b, 0),
                         '"$ 01 01 01 01 01 01 01 01                           ........        \\n" // 00-07');
        });

        it('formats a nine-byte DATA body line', function () {
            var b = new Buffer(9);

            b.fill(65);

            assert.equal(dumpFormatter.dataBodyLine(b, 0),
                         '"$ 41 41 41 41 41 41 41 41  41                       AAAAAAAAA       \\n" // 00-08');
        });

        it('formats a 15-byte DATA body line', function () {
            var b = new Buffer(15);

            b.fill(128);

            assert.equal(dumpFormatter.dataBodyLine(b, 0),
                         '"$ 80 80 80 80 80 80 80 80  80 80 80 80 80 80 80     ............... \\n" // 00-0E');
        });
    });

    it('formats a dummy file', function () {
        var b = new Buffer(1);

        b.fill(0);

        assert.equal(dumpFormatter({
            filename: 'cat.exe',
            mtime: new Date('Mon 10 Oct 2011 23:24:11 GMT'),
            offset: 0,
            buffer: b
        }),
                     "// Extracted from cat.exe [Mon, 10 Oct 2011 23:24:11 GMT]\n" +
                     "// 1 bytes from 0x00000000 to 0x00000001\n" +
                     "const char * cat_exe_0x00000000_1 =\\\n" +
                     '"Data: DATA 1\\n"\n' +
                     '"$ 00                                                .               \\n" // 00-00\n' +
                     ";"
                    );
    });

});

describe('regression tests', function () {
    it('escapes / in filenames to _', function () {
        assert.equal('test_cat_exe', dumpFormatter.c_escape('test/cat.exe'));
    });

    it('escapes multiple / in filenames to _', function () {
        assert.equal('test_fixtures_cat_exe', dumpFormatter.c_escape('test/fixtures/cat.exe'));
    });

    it('escapes backslash and quote to dot', function () {
        assert.equal(dumpFormatter.escapeChar('\\'.charCodeAt(0)), '.');
        assert.equal(dumpFormatter.escapeChar('"'.charCodeAt(0)), '.');
    });
});
