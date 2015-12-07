var package = require('../../package.json');

var domains = require('../domains');
var services = require('../services');
var backup = require('../backup');
var utils = require('../utils');
var _ = require('lodash');

var cmd = module.exports = {};

cmd.register = function(program) {
    return program.command('backup <domain> <backupID>', 'save a backup to disk')
};

cmd.registerFull = function(program) {
    return program.arguments('<domain> <backupID>');
};

cmd.action = function(options, cb) {
    var domain = options.args[0];
    var backupID = options.args[1] || backup.generateID();
    var conf = domains.safeLoad(domain);
    var backupConf = backup.conf(conf, backupID);

    if (conf.version !== package.version)
        return utils.error(cb, "Domain isn't using the same version as the tool, use `shasoco version` to fix that");

    var tmpPath = backupConf.backupPath;
    var run = backup.run(domain);
    var finalPath = domains.path(conf.name) + "/backups";
    var finalTar = finalPath + "/" + backupID + ".tar.gz";

    // Backup the project config
    run("mkdir -p " + tmpPath);
    run("cp `find " + domains.path(conf.name) + " -maxdepth 1 -type f` " + tmpPath);

    // Backup service into its own subdirectory
    utils.callForAll(services, 'backup', backupConf);

    // Create the final archive
    run("mkdir -p " + finalPath);
    run("rm -f " + finalTar);
    run("sh -c 'cd " + tmpPath + "; tar -cvzf " + finalTar + " .'");
    run("rm -rf " + tmpPath);
};
