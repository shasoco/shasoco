var cmd = module.exports = {};

var mods = cmd.mods = {
    package: require('../../package.json'),
    deploys: require('../deploys'),
    services: require('../services'),
    utils: require('../utils')
};

cmd.register = function(program) {
    return program.command('upgrade <deploy-id>', 'update services to a given shasoco version')
};

cmd.registerFull = function(program) {
    return program
        .arguments('<deploy-id>')
        .option('--force', 'Force to perform the upgrade')
        .option('--no-pull', 'Do not pull docker images');
};

cmd.action = function(options, cb) {
    var id = options.args[0];
    var version = mods.package.version;
    var conf = mods.deploys.safeLoad(id);

    // Check if upgrade is possible and necessary
    if (!options.force && conf.version == version)
        return mods.utils.error(cb, "Already using the given version");

    var needUpgradeTo = mods.utils.minVersion(conf.version);
    if (!options.force && !needUpgradeTo(version))
        return mods.utils.error(cb, "Already using a newer version");

    if (!options.force && version !== mods.package.version)
        return mods.utils.error(cb, "You're not running shasoco " + version + ". Please update with 'shasoco version'");

    if (!options.force && conf.upgradeInProgress)
        return mods.utils.error(cb, "An upgrade is already in progress (or was interrupted). Please check what happened. You can bypass this by editing the project's config.yml file located in ~/.shasoco/deploys");

    if (!options.force && conf.status !== 'UP')
        return mods.utils.error(cb, "Make sure the deploy is UP and running before doing the upgrade");

    // All good, let's go
    console.log("Upgrading to " + version);
    conf.upgradeInProgress = true;
    mods.deploys.save(conf);

    // Pre-upgrade all services
    mods.utils.callForAll(mods.services, 'preUpgrade', conf);

    // Turn all services down
    var compose = mods.deploys.compose(conf);
    mods.utils.callForAll(mods.services, 'down', conf);

    // Let's get really sure all are stopped
    compose('stop');

    // Update compose files
    mods.deploys.upgrade(conf, mods.services);

    // Pull updated images
    if (options.pull)
        compose('pull');

    // Upgrade all services
    mods.utils.callForAll(mods.services, 'upgrade', conf);

    // Restart the services (if deploy was already up)
    mods.utils.callForAll(mods.services, 'up', conf);

    // Post-upgrade all services
    mods.utils.callForAll(mods.services, 'postUpgrade', conf);

    // Bump the version number
    conf.version = version;
    delete conf.upgradeInProgress;
    mods.deploys.save(conf);
};

