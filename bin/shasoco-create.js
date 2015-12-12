#!/usr/bin/env node
var cmd = require('../lib/commands').create;
var args = cmd.registerFull(require('commander')).parse(process.argv);
cmd.action(args);
