/*global describe, it*/
'use strict';

var assert = require('assert');
var extractor = require('../lib/extractor');

it('imports the module', function () {
    assert.ok(extractor);
});

describe('extractor', function () {

    it('returns err for nonexistent file', function (done) {
        extractor('fixtures/nonexistent', 0, 16, function (err, file) {
            /*jslint unparam:true*/
            assert.ok(err !== null);
            done();
        });
    });

    it('returns a file struct asynchronously', function (done) {
        extractor('test/fixtures/cat.exe', 0, 16, function (err, file) {
            assert.equal(err, null);
            assert.ok(file);
            done();
        });
    });

    it('includes the modified time and data', function (done) {
        var name = 'test/fixtures/cat.exe';
        extractor(name, 0, 2, function (err, file) {
            assert.equal(err, null);
            assert.equal(file.filename, name);
            assert.equal(file.mtime.toUTCString(), "Tue, 07 Oct 2014 12:42:29 GMT");
            assert.equal(file.buffer, "MZ");
            done();
        });
    });

    describe('error handler tests', function () {
        it('handles file-open errors', function (done) {
            var file = new extractor.File('foo', 0, 16, function (err, f) {
                assert.equal(undefined, f);
                assert.notEqual(null, err);
                assert.ok(err instanceof Error);
                done();
            });

            file.onOpen(new Error('sample error'));
        });

        it('handles file-stat errors', function (done) {
            var file = new extractor.File('foo', 0, 16, function (err, f) {
                assert.equal(undefined, f);
                assert.notEqual(null, err);
                assert.ok(err instanceof Error);
                done();
            });

            file.onStat(new Error('sample error'));
        });

        it('handles file-read errors', function (done) {
            var file = new extractor.File('foo', 0, 16, function (err, f) {
                assert.equal(undefined, f);
                assert.notEqual(null, err);
                assert.ok(err instanceof Error);
                done();
            });

            file.onRead(new Error('sample error'));
        });

    });
});
