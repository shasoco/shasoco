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

    if (conf.version !== package.version)
        return utils.error(cb, "Domain isn't using the right version");

    var tmpPath   = backup.tmpPath(backupID);
    var run = backup.run(domain);

    // Create backup config
    var backupConf = _.extend({
        backupID: backupID,
        backupPath: tmpPath
    }, conf);

    // Backup the project config
    run("mkdir -p " + tmpPath);
    run("cp `find " + domains.path(conf.name) + " -maxdepth 1 -type f` " + tmpPath);

    // Backup service into its own subdirectory
    utils.callForAll(services, 'backup', backupConf);

    // Create the final archive
    var finalPath = domains.path(conf.name) + "/backups";
    var finalTar = finalPath + "/" + backupID + ".tar.gz";
    run("mkdir -p " + finalPath);
    run("rm -f " + finalTar);
    run("sh -c 'cd " + tmpPath + "; tar -cvzf " + finalTar + " .'");
    run("rm -fr " + tmpPath);
};
