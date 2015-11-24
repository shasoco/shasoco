var domains = require('../domains');
var utils = require('../utils');

var cmd = module.exports = {};

cmd.defaults = {
};

cmd.register = function(program) {
    return program.command('ps', 'list running projects')
};

cmd.registerFull = function(program) {
    return program;
};

var format = function(conf) {
    var pl = utils.padLeft;
    var pr = utils.padRight;
    return pl(conf.name, 20) + "    " + pr(conf.port,10) + pr(conf.version,10) + conf.status;
};

cmd.action = function(options) {
    console.log(format({
        name: 'NAME',
        port: 'PORT',
        version: 'VERSION',
        status: 'STATUS'
    }));
    domains.list()
    .forEach(function(conf) {
        console.log(format(conf));
    });
};
