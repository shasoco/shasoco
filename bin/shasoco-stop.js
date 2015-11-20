#!/usr/bin/env node
require('../lib/commands')
    .stop.registerFull(require('commander'))
    .parse(process.argv);
