#!/usr/bin/env node
require('../lib/commands')
    .ps.registerFull(require('commander'))
    .parse(process.argv);
