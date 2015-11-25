var package = require('../../package.json');

var domains = require('../domains');
var services = require('../services');
var utils = require('../utils');

var cmd = module.exports = {};

cmd.defaults = {};

cmd.register = function(program) {
    return program.command('stop <domain>', 'stop the servers, do not destroy data')
};

cmd.registerFull = function(program) {
    return program.arguments('<domain>');
};

cmd.action = function(options, cb) {
    var domain = options.args[0];
    var conf = domains.safeLoad(domain);

    if (conf.version !== package.version)
        return utils.error(cb, "Domain isn't using the right version");

    if (conf.status !== 'UP')
        return utils.error(cb, "Domain is " + conf.status);

    utils.callForAll(services, 'down', conf);

    domains.compose(conf, 'stop');
};
