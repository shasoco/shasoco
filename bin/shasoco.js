#!/usr/bin/env node

var createProgram = function(commands) {
    var package = require('../package.json');
    var program = require('commander')
        .version(package.version);
    commands.forEach(function(name, command) {
        program = command.register(program);
    });
    return program;
};

var commands = require('../lib/commands');
var program = createProgram(commands);
program.parse(process.argv);
