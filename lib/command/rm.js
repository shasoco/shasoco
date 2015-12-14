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
    if (!id)
        return mods.utils.error(cb, "<deploy-id> missing");

    var conf = mods.deploys.safeLoad(id);
    if (!conf)
        return mods.utils.error(cb, "can't load config file");

    // Compile the project's files
    mods.deploys.prepare(conf, mods.services);

    if (options.force) {
        mods.deploys.compose(conf, 'kill');
    }
    else {
        if (conf.status === 'UP')
            return mods.utils.error(cb, "Deploy is " + conf.status);

        if (conf.version !== mods.package.version)
            return mods.utils.error(cb, "Deploy isn't using the right version");
    }
    mods.deploys.compose(conf, 'rm -f -v');
    mods.deploys.remove(conf);
};
