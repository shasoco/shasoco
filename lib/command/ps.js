var cmd = module.exports = {};

var R = require('ramda');

var mods = cmd.mods = {
    deploys: require('../deploys'),
    utils: require('../utils'),
    console: console
};

cmd.register = function(program) {
    return program.command('ps', 'list deploys')
};

cmd.registerFull = function(program) {
    return program;
};

var format = function(conf) {
    var pl = mods.utils.padLeft;
    var pr = mods.utils.padRight;
    return pl(conf.id, 20) + "    " + pr(conf.port,10) + pr(conf.version,10) + conf.status;
};

cmd.action = function() {

    // Format and log a service config
    var logDeploy = R.compose(mods.console.log.bind(mods.console), format);

    logDeploy({
        id: 'ID',
        port: 'PORT',
        version: 'VERSION',
        status: 'STATUS'
    });
    mods.deploys.list().forEach(logDeploy);
};
