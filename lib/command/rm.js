var cmd = module.exports = {};

var mods = cmd.mods = {
    package: require('../../package.json'),
    deploys: require('../deploys'),
    services: require('../services'),
    utils: require('../utils')
};

cmd.defaults = {
    force: false
};

cmd.register = function(program) {
    return program.command('rm <deploy-id>', 'delete all data, but not the backups!')
};

cmd.registerFull = function(program) {
    return program
        .arguments('<deploy-id>')
        .option('-f, --force', 'Ignore all errors');
};

cmd.action = function(options, cb) {
    var id = options.args[0];
    var conf = mods.deploys.safeLoad(id);

    if (options.force) {
        mods.deploys.compose(conf, 'kill');
        mods.deploys.compose(conf, 'rm -f -v');
    }
    else {
        if (conf.status === 'UP')
            return mods.utils.error(cb, "Domain is " + conf.status);

        if (conf.version !== package.version)
            return mods.utils.error(cb, "Domain isn't using the right version");

        mods.utils.callForAll(mods.services, 'rm', conf);

        mods.deploys.compose(conf, 'rm -f -v');
    }

    mods.deploys.remove(conf);
};
