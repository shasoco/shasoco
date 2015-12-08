var cmd = module.exports = {};

var R = require('ramda');

var mods = cmd.mods = {
    domains: require('../domains'),
    utils: require('../utils'),
    console: console
};

cmd.register = function(program) {
    return program.command('ps', 'list running projects')
};

cmd.registerFull = function(program) {
    return program;
};

var format = function(conf) {
    var pl = mods.utils.padLeft;
    var pr = mods.utils.padRight;
    return pl(conf.name, 20) + "    " + pr(conf.port,10) + pr(conf.version,10) + conf.status;
};

cmd.action = function(options) {

    // Format and log a service config
    var logDomain = R.compose(mods.console.log.bind(mods.console), format);

    logDomain({
        name: 'NAME',
        port: 'PORT',
        version: 'VERSION',
        status: 'STATUS'
    });
    mods.domains.list().forEach(logDomain);
};
