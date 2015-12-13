var cmd = module.exports = {};

// Export loaded modules for testability
var mods = cmd.mods = {
    utils: require('../utils'),
    deploys: require('../deploys'),
    services: require('../services'),
    package: require('../../package.json')
};

cmd.register = function(program) {
    return program.command('command <deploy-id>', 'do some stuff')
};

cmd.registerFull = function(program) {
    return program.arguments('<deploy-id>')
        .option('--option', 'Activate option');
};

cmd.action = function(options, cb) {

    // Load the deploy's configuration
    var id = options.args[0];
    if (!id) {
        return mods.utils.error(cb, "<deploy-id> missing");
    }
    var conf = mods.deploys.safeLoad(id);
    if (!conf) return;

    // ... more code here
};

