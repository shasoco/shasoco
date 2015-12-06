#!/usr/bin/env node
var cmd = require('../lib/commands').backup;
var args = cmd.registerFull(require('commander')).parse(process.argv);
cmd.action(args);
