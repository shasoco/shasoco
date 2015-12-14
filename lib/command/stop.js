var cmd = module.exports = {};

var mods = cmd.mods = {
    package: require('../../package.json'),
    deploys: require('../deploys'),
    services: require('../services'),
    shell: require('shelljs'),
    utils: require('../utils')
};

cmd.register = function(program) {
    return program.command('stop <deploy-id>', 'stop the servers, do not destroy data')
};

cmd.registerFull = function(program) {
    return program.arguments('<deploy-id>');
};

var stop = function(conf) {
    // Retrieve computes
    var computes = [];
    mods.services.forEach(function(s) {
        if (s.computes) {
            s.computes.forEach(function(c) {
                var ar = c.split("(");
                computes.push(ar[0]);
            });
        }
    });

    // Stop all
    mods.deploys.compose(conf, 'stop');

    // Remove all computes
    mods.deploys.compose(conf, "rm -f " + computes.join(" "));
};

var clean = function(conf) {
    mods.services.forEach(function(s) {
        if (s.otherFiles) {
            s.otherFiles.forEach(function(c) {
                mods.shell.exec("rm -f " + mods.deploys.path(conf.id) + "/" + c);
            });
        }
    });
    mods.shell.exec("rm -f " + mods.deploys.path(conf.id) + "/docker-compose.yml");
};

cmd.action = function(options, cb) {
    var id = options.args[0];
    if (!id)
        return mods.utils.error(cb, "<deploy-id> missing");

    var conf = mods.deploys.safeLoad(id);
    if (!conf)
        return mods.utils.error(cb, "can't load config file");

    if (conf.version !== mods.package.version)
        return mods.utils.error(cb, "Deploy isn't using the right version");

    stop(conf);
    clean(conf);
};
