var cmd = module.exports = {};

// Export loaded modules for testability
var mods = cmd.mods = {
    utils: require('../utils'),
    deploys: require('../deploys'),
    metaproxy: require('../metaproxy'),
    package: require('../../package.json')
};

cmd.register = function(program) {
    return program.command('deactivate <domain>', 'enable maintenance mode for a domain')
};

cmd.registerFull = function(program) {
    return program.arguments('<domain>');
};

cmd.action = function(options, cb) {

    // Load the deploy's configuration
    var domain = options.args[0];
    if (!domain) {
        return mods.utils.error(cb, "<domain> missing");
    }

    mods.metaproxy.deactivate(domain, function() {
        console.log("done");
    });
};
