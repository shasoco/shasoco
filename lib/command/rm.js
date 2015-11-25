var package = require('../../package.json');

var domains = require('../domains');
var services = require('../services');
var utils = require('../utils');

var cmd = module.exports = {
    force: false
};

cmd.defaults = {};

cmd.register = function(program) {
    return program.command('rm <domain>', 'delete all data, but not the backups!')
};

cmd.registerFull = function(program) {
    return program
        .arguments('<domain>')
        .option('-f, --force', 'Ignore all errors');
};

cmd.action = function(options, cb) {
    var domain = options.args[0];
    var conf = domains.safeLoad(domain);

    if (options.force) {
        domains.compose(conf, 'rm -f -v');
    }
    else {
        if (conf.status === 'UP')
            return utils.error(cb, "Domain is " + conf.status);

        if (conf.version !== package.version)
            return utils.error(cb, "Domain isn't using the right version");

        utils.callForAll(services, 'rm', conf);

        domains.compose(conf, 'rm -v');
    }

    domains.remove(conf);
};
