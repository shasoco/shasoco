var cmd = module.exports = {};

var mods = cmd.mods = {
    package: require('../../package.json'),
    deploys: require('../deploys'),
    services: require('../services'),
    utils: require('../utils')
};

cmd.register = function(program) {
    return program.command('up <deploy-id>', 'start the services')
};

cmd.registerFull = function(program) {
    return program.arguments('<deploy-id>');
};

cmd.action = function(options, cb) {
    var id = options.args[0];
    if (!id) {
        return mods.utils.error(cb, "<deploy-id> missing");
    }

    var conf = mods.deploys.safeLoad(id);
    if (!conf) return;

    if (conf.version !== mods.package.version)
        return mods.utils.error(cb, "Deploy isn't using the right version");

    if (conf.status === 'UP')
        return mods.utils.error(cb, "Deploy is UP already");

    if (conf.deployed) {
        mods.utils.callForAll(mods.services, 'up', conf);
    }
    else {
        mods.services.forEach(function(s) {
            if (s.deploy)
                s.deploy(conf);
            else
                s.up(conf);
        });
        conf.deployed = true;
        mods.deploys.save(conf);
    }
};
