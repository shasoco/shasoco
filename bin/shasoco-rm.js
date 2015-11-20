#!/usr/bin/env node
require('../lib/commands')
    .rm.registerFull(require('commander'))
    .parse(process.argv);
