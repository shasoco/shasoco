var cmd = module.exports = {};

var mods = cmd.mods = {
    package: require('../../package.json'),
    deploys: require('../deploys'),
    services: require('../services'),
    utils: require('../utils')
};

cmd.register = function(program) {
    return program.command('up <deploy-id>', 'start the servers')
};

cmd.registerFull = function(program) {
    return program.arguments('<deploy-id>');
};

cmd.action = function(options, cb) {
    var id = options.args[0];
    var conf = mods.deploys.safeLoad(id);

    if (conf.version !== package.version)
        return mods.utils.error(cb, "Deploy isn't using the right version");

    if (conf.status === 'UP')
        return mods.utils.error(cb, "Deploy is UP already");

    mods.utils.callForAll(mods.services, 'up', conf);
};
