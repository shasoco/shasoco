#!/usr/bin/env node
var cmd = require('../lib/commands').ps;
cmd.registerFull(require('commander')).parse(process.argv);
if (process.argv.length === 2) {
    cmd.action();
}
