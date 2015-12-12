var cmd = module.exports = {};

// Export loaded modules for testability
var mods = cmd.mods = {
    utils: require('../utils'),
    deploys: require('../deploys'),
    services: require('../services'),
    package: require('../../package.json')
};

cmd.defaults = {};

cmd.register = function(program) {
    return program.command('prepare <deploy-id>', 'prepare a deployment')
};

cmd.registerFull = function(program) {
    return program.arguments('<deploy-id>')
        .option('--no-pull', 'Do not pull images');
};

cmd.action = function(options, cb) {

    var id = options.args[0];
    if (!id) {
        return mods.utils.error(cb, "<deploy-id> missing");
    }

    var conf = mods.deploys.safeLoad(id);
    if (!conf) return;

    // Compile the project's files
    mods.deploys.prepare(conf, mods.services);

    // Pull all images (except if asked not to)
    if (options.pull) {
        mods.deploys.compose(conf, 'pull');
    }
};
