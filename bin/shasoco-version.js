#!/usr/bin/env node
require('../lib/commands')
    .version.registerFull(require('commander'))
    .parse(process.argv);
