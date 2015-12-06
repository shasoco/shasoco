var package = require('../../package.json');

var domains = require('../domains');
var services = require('../services');
var utils = require('../utils');
var _ = require('lodash');
var shell = require('shelljs');

var cmd = module.exports = {};

cmd.register = function(program) {
    return program.command('backup <domain>', 'save a backup to disk')
};

cmd.registerFull = function(program) {
    return program.arguments('<domain> <filename>');
};

var genBackupName = function() {
    return new Date().toISOString().
      replace(/T/, '_').
      replace(/\..+/, '').
      replace(/[:-]/g, '');
};

cmd.action = function(options, cb) {
    var domain = options.args[0];
    var backupName = options.args[1] || genBackupName();
    var conf = domains.safeLoad(domain);

    if (conf.version !== package.version)
        return utils.error(cb, "Domain isn't using the right version");

    // Create backup config
    var backupConf = _.extend({
        backupName: backupName
    }, conf);

    var backupRun = function(conf, cmd) {
        shell.exec("docker run --rm " +
                   "--volumes-from " + domains.composeName(conf.name) + "_backup_1 " +
                   "--volumes-from shasocodata " +
                   "debian:jessie " + cmd);
    };
    var backupPath = "/shasoco-backup/" + backupName;

    // Backup the project config
    backupRun(backupConf, "mkdir -p " + backupPath);
    backupRun(backupConf, "cp `find " + domains.path(conf.name) + " -maxdepth 1 -type f` " + backupPath);

    // Backup service into its own subdirectory
    utils.callForAll(services, 'backup', backupConf);

    // Create the final archive
    var finalPath = domains.path(conf.name) + "/backups";
    var finalTar = finalPath + "/" + backupName + ".tar.gz";
    backupRun(backupConf, "mkdir -p " + finalPath);
    backupRun(backupConf, "rm -f " + finalTar);
    backupRun(backupConf, "sh -c 'cd " + backupPath + "; tar -cvzf " + finalTar + " .'");
    backupRun(backupConf, "rm -fr " + backupPath);
};
