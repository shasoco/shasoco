#!/usr/bin/env node
require('../lib/commands')
    .upgrade.registerFull(require('commander'))
    .parse(process.argv);
