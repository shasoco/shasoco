var cmd = module.exports = {};

var mods = cmd.mods = {
    package: require('../../package.json'),
    deploys: require('../deploys'),
    services: require('../services'),
    shell: require('shelljs'),
    utils: require('../utils'),
    console: console
};
var _ = require('lodash');

cmd.register = function(program) {
    return program.command('inspect <deploy-id>', 'display informations about a deploy')
};

cmd.registerFull = function(program) {
    return program.arguments('<deploy-id>');
};

cmd.action = function(options, cb) {
    var id = options.args[0];
    if (!id)
        return mods.utils.error(cb, "<deploy-id> missing");

    var conf = mods.deploys.safeLoad(id);
    if (!conf)
        return mods.utils.error(cb, "can't load config file");

    if (conf.version !== mods.package.version)
        return mods.utils.error(cb, "Deploy isn't using the right version");

    mods.console.dir(_.pick(conf, [
        'id',
        'domain',
        'httpPort',
        'httpsPort',
        'gitSshPort',
        'sslcertselfsigned',
        'version',
        'rootpassword',
        'adminpassword',
        'status',
        'vaultpath'
    ]));
};
