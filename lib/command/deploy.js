var cmd = module.exports = {};

var mods = cmd.mods = {
    utils: require('../utils'),
    deploys: require('../deploys'),
    services: require('../services')
};

cmd.register = function(program) {
    return program.command('deploy <deploy-id>', 'launch a deploy for the first time')
};

cmd.registerFull = function(program) {
    return program.arguments('<deploy-id>')
};

cmd.action = function(options, cb) {

    var id = options.args[0];
    if (!id) {
        return mods.utils.error(cb, "<deploy-id> missing");
    }

    var conf = mods.deploys.safeLoad(id);

    // start
    mods.services.forEach(function(s) {
        if (s.deploy)
            s.deploy(conf);
        else
            s.up(conf);
    });

    // TODO: restore backup
};
