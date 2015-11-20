#!/usr/bin/env node
require('../lib/commands')
    .restore.registerFull(require('commander'))
    .parse(process.argv);
