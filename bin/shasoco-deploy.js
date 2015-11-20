#!/usr/bin/env node
require('../lib/commands')
    .deploy.registerFull(require('commander'))
    .parse(process.argv);
