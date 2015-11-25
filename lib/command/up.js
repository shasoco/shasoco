var package = require('../../package.json');

var domains = require('../domains');
var services = require('../services');
var utils = require('../utils');

var cmd = module.exports = {};

cmd.defaults = {};

cmd.register = function(program) {
    return program.command('up <domain>', 'start the servers')
};

cmd.registerFull = function(program) {
    return program.arguments('<domain>');
};

cmd.action = function(options, cb) {
    var domain = options.args[0];
    var conf = domains.safeLoad(domain);

    if (conf.version !== package.version)
        return utils.error(cb, "Domain isn't using the right version");

    if (conf.status === 'UP')
        return utils.error(cb, "Domain is UP already");

    utils.callForAll(services, 'up', conf);
};
