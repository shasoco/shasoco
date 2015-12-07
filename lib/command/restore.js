var package = require('../../package.json');

var domains = require('../domains');
var services = require('../services');
var backup = require('../backup');
var utils = require('../utils');

var yaml = require('js-yaml');

var cmd = module.exports = {};

cmd.register = function(program) {
    return program.command('restore <domain> <backupID>', 'restore a backup')
};

cmd.registerFull = function(program) {
    return program.arguments('<domain> <backupID>')
        .option('-f, --force',
                'Force the backup to be restored (unsafe)')
};

cmd.action = function(options, cb) {
    var domain = options.args[0];
    var backupID = options.args[1] || backup.generateID();
    var force = options.force;
    var conf = domains.safeLoad(domain);
    var backupConf = backup.conf(conf, backupID);

    if (conf.version !== package.version)
        return utils.error(cb, "Domain isn't using the same version as the tool, use `shasoco version` to fix that");

    var tmpPath = backupConf.backupPath;
    var run = backup.run(domain);
    var finalPath = domains.path(conf.name) + "/backups";
    var finalTar = finalPath + "/" + backupID + ".tar.gz";

    // Extract the archive into tmpPath
    run("test -e " + finalTar);
    run("mkdir -p " + tmpPath);
    run("sh -c 'cd " + tmpPath + "; tar -xvzf " + finalTar + "'");

    // Check backup version number, validate configuration files
    var configData = run("cat " + tmpPath + "/config.yml").output;
    var newConfig = yaml.safeLoad(configData);
    if (newConfig.version !== package.version)
        return utils.error(cb, "Backup is using version " + newConfig.version + ", whereas we're running " + package.version);
    if (newConfig.name !== conf.name && !force)
        return utils.error(cb, "Something isn't right: backup was created for domain " + newConfig.name + ", use --force if you know what you're doing");
    var files = run("find " + tmpPath + " -maxdepth 1 -type f").output.split("\n");
    run("cp " + files.join(" ") + " " + domains.path(conf.name) + "/");

    // Call restore for each service
    utils.callForAll(services, 'restore', backupConf);

    // Cleanup tmpPath
    run("rm -rf " + tmpPath);
};
