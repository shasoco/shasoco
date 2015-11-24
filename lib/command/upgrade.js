var package = require('../../package.json');
var domains = require('../domains');
var services = require('../services');
var utils = require('../utils');
var callForAll = utils.callForAll;

var cmd = module.exports = {};

cmd.defaults = {
    'version': package.version
};

cmd.register = function(program) {
    return program.command('upgrade <domain>', 'update services to a given shasoco version')
};

cmd.registerFull = function(program) {
    return program
        .arguments('<domain>')
        .option('--upgrade-version [VERSION]',
                'Version number (default=' + cmd.defaults.version + ')');
};

cmd.action = function(options, cb) {
    var domain = options.args[0];
    var version = options.upgradeVersion || cmd.defaults.version;

    // Check if upgrade is possible and necessary
    if (!domain)
        return utils.error(cb, "domain missing");
    if (!domains.exists(domain))
        return utils.error(cb, "domain doesn't exist");

    var conf = domains.load(domain);
    if (conf.version == version)
        return utils.error(cb, "Already using the given version");

    var needUpgradeTo = utils.minVersion(conf.version);
    if (!needUpgradeTo(version))
        return utils.error(cb, "Already using a newer version");

    if (version !== package.version)
        return utils.error(cb, "You're not running shasoco " + version + ". Please update with 'shasoco version'");

    if (conf.upgradeInProgress)
        return utils.error(cb, "An upgrade is already in progress (or was interrupted). Please check what happened. You can bypass this by editing the project's config.yml file located in ~/.shasoco/domains");

    if (conf.status !== 'UP')
        return utils.error(cb, "Make sure the domain is UP and running before doing the upgrade");

    // All good, let's go
    console.log("Upgrading to " + version);
    conf.upgradeInProgress = true;
    domains.save(conf);

    // Pre-upgrade all services
    callForAll(services, 'preUpgrade', conf);

    // Turn all services down
    var compose = domains.compose(conf);
    callForAll(services, 'down', conf);

    // Let's get really sure all are stopped
    compose('stop');

    // Update compose files
    domains.upgrade(conf);

    // Pull updated images
    compose('pull');

    // Upgrade all services
    callForAll(services, 'upgrade', conf);

    // Restart the services (if domain was already up)
    callForAll(services, 'up', conf);

    // Post-upgrade all services
    callForAll(services, 'postUpgrade', conf);

    // Bump the version number
    conf.version = version;
    delete conf.upgradeInProgress;
    domains.save(conf);
};

