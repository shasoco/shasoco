var package = require('../../package.json');
var utils = require('../utils');
var domains = require('../domains');

var cmd = module.exports = {};

cmd.defaults = {
    'port': 80
};

cmd.register = function(program) {
    return program.command('deploy <domain>', 'deploy a new infrastructure project')
};

cmd.registerFull = function(program) {
    return program
        .arguments('<domain>')
        .option('-p, --port [PORT]',
                'Port to expose (default=' + cmd.defaults.port + ')')
        .option('-b, --backup [BACKUP_TGZ]',
                'Backup file deploy from');
};

cmd.action = function(options, cb) {

    // domain name
    var domain = options.args[0];
    if (!domain) {
        return utils.error(cb, "domain missing");
    }

    // TODO: read backup metadata (version)
    if (options.backup) {
    }

    // generate a project
    if (domains.exists(domain)) {
        return utils.error(cb, "domain already exists");
    }
    var conf = domains.create(domain, {
        port: options.port || cmd.defaults.port,
        version: package.version
    });

    // start
    var services = require('../services');
    services.forEach(function(s) {
        if (s.deploy)
            s.deploy(conf);
        else
            s.up(conf);
    });
};
