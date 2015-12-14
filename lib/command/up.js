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
    if (!id)
        return mods.utils.error(cb, "<deploy-id> missing");

    var conf = mods.deploys.safeLoad(id);
    if (!conf)
        return mods.utils.error(cb, "can't load config file");

    if (conf.version !== mods.package.version)
        return mods.utils.error(cb, "Deploy isn't using the right version");

    // Compile the project's files
    mods.deploys.prepare(conf, mods.services);

    // Retrieve computes
    var computes = [];
    mods.services.forEach(function(s) {
        if (s.computes) {
            s.computes.forEach(function(c) {
                computes.push(c);
            });
        }
    });

    // Start all computes
    var compose = mods.deploys.compose;
    computes.forEach(function(c) {
        //console.log(" >> " + c);
        var ar = c.split("(");
        var name = ar[0];
        var delay = parseInt(ar[1])|0;
        compose(conf, "up -d --no-deps " + name);
        if (delay > 0)
            mods.utils.sleep(delay * 1000, 'Waiting for ' + name);
    });

    // Initialize
    if (!conf.initialized) {
        mods.utils.callForAll(mods.services, 'init', conf);
        conf.initialized = true;
        mods.deploys.save(conf);
    }
};

