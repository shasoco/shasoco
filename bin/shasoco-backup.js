#!/usr/bin/env node
require('../lib/commands')
    .backup.registerFull(require('commander'))
    .parse(process.argv);
