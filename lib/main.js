// Copyright 2014 Cubane Canada
// Released under MIT license - see LICENSE for details
'use strict';

var extract = require('./extractor'),
    formatDump = require('./dump-formatter');

function Main(program, con, pro) {
    var main = this;

    main.program = program;
    main.con = con;
    main.pro = pro;

    main.extract = extract;
    main.formatDump = formatDump;

    main.run = function Main$run() {
        var args = program.args;

        if (args.length !== 3) {
            con.log('Expected 3 arguments: <file> <offset> <length>');
            pro.exit(1);
            return;
        }

        main.extract(args[0], parseInt(args[1], 0), parseInt(args[2], 0),
                main.onExtract);
    };

    main.onExtract = function Main$onExtract(err, file) {
        if (err) {
            con.log(err);
            pro.exit(1);
            return;
        }

        con.log(main.formatDump(file));
        pro.exit(0);
        return;
    };
}

function main(program, con, pro) {
    var m = new Main(program, con, pro);
    m.run();
}

// public API
module.exports = main;

// testing API
main.Main = Main;
