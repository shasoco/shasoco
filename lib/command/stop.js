var cmd = module.exports = {};

var mods = cmd.mods = {
    package: require('../../package.json'),
    deploys: require('../deploys'),
    services: require('../services'),
    utils: require('../utils')
};

cmd.register = function(program) {
    return program.command('stop <deploy-id>', 'stop the servers, do not destroy data')
};

cmd.registerFull = function(program) {
    return program.arguments('<deploy-id>');
};

cmd.action = function(options, cb) {
    var id = options.args[0];
    var conf = mods.deploys.safeLoad(id);
    if (!conf) return;

    if (conf.version !== mods.package.version)
        return mods.utils.error(cb, "Domain isn't using the right version");

    if (conf.status !== 'UP')
        return mods.utils.error(cb, "Domain is " + conf.status);

    mods.utils.callForAll(mods.services, 'down', conf);

    mods.deploys.compose(conf, 'stop');
};
