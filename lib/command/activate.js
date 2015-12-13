var cmd = module.exports = {};

// Export loaded modules for testability
var mods = cmd.mods = {
    utils: require('../utils'),
    deploys: require('../deploys'),
    metaproxy: require('../metaproxy'),
    package: require('../../package.json')
};

cmd.register = function(program) {
    return program.command('activate <deploy-id>', 'route traffic to this deploy')
};

cmd.registerFull = function(program) {
    return program.arguments('<deploy-id>');
};

cmd.action = function(options, cb) {

    // Load the deploy's configuration
    var id = options.args[0];
    if (!id) {
        return mods.utils.error(cb, "<deploy-id> missing");
    }
    var conf = mods.deploys.safeLoad(id);
    if (!conf) return;

    if (conf.status !== 'UP') {
        return mods.utils.error(cb, "deploy is not UP");
    }
    mods.metaproxy.activate(conf);
};


