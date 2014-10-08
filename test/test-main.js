/*global describe, it*/
'use strict';

var assert = require('assert');
var main = require('../lib/main');

it('imports the module', function () {
    assert.ok(main);
});

function mockConsole() {
    var con = {
        logLines: [],
        log: function (line) {
            con.logLines.push(String(line));
        }
    };

    return con;
}

function mockProcess() {
    var pro = {
        exitCode: undefined,
        exit: function (code) {
            pro.exitCode = code;
        }
    };

    return pro;
}


describe('the main routine', function () {
    it('expects three arguments', function () {
        assert.equal(3, main.length);
    });

    it('reports error if 3 command-line params not passed', function () {
        var program = {
            args: ['foo']
        },
            con = mockConsole(),
            pro = mockProcess();

        main(program, con, pro);

        assert.equal(pro.exitCode, 1);
        assert.ok(con.logLines[0].match(/xpected/));
    });

    it('tries to extract if 3 command-line params are passed', function (done) {
        var program = {
            args: ['foo', '0x10', '15']
        },
            con = mockConsole(),
            pro = mockProcess(),
            m = new main.Main(program, con, pro);

        m.extract = function (file, offset, length, callback) {
            assert.equal(file, program.args[0]);
            assert.equal(offset, 16);
            assert.equal(length, 15);
            assert.equal(callback, m.onExtract);
            done();
        };

        m.run();
    });

    it('reports file errors instead of dumping', function () {
        var program = {
            args: ['foo', '0x10', '15']
        },
            con = mockConsole(),
            pro = mockProcess(),
            m = new main.Main(program, con, pro);

        m.onExtract(new Error('some kind of file error', undefined));

        assert.equal(pro.exitCode, 1);
        assert.ok(con.logLines[0].match(/kind of file error/));
    });

    it('dumps valid output', function () {
        var program = {
            args: ['foo', '0x10', '15']
        },
            con = mockConsole(),
            pro = mockProcess(),
            f = { name: 'dummy' },
            m = new main.Main(program, con, pro);

        m.formatDump = function (file) {
            assert.equal(f, file);
            return "normal output";
        };

        m.onExtract(null, f);

        assert.equal(pro.exitCode, 0);
        assert.ok(con.logLines[0].match(/normal output/));
    });
});
