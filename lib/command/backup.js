var package = require('../../package.json');

var domains = require('../domains');
var services = require('../services');
var utils = require('../utils');
var _ = require('lodash');
var shell = require('shelljs');

var cmd = module.exports = {};

cmd.defaults = {
    'backupFile': '-'
};

cmd.register = function(program) {
    return program.command('backup <domain>', 'save a backup to disk')
};

cmd.registerFull = function(program) {
    return program
        .arguments('<domain>')
        .option('--backup-file [BACKUP_TGZ]',
                'Backup file to save to (default=stdout)');
};

var backupName = function() {
    return new Date().toISOString().
      replace(/T/, '_').
      replace(/\..+/, '').
      replace(/[:-]/g, '');
};

cmd.action = function(options, cb) {
    var domain = options.args[0];
    var conf = domains.safeLoad(domain);

    if (conf.version !== package.version)
        return utils.error(cb, "Domain isn't using the right version");

    // Backup service into its own subdirectory
    var backupConf = _.extend({
        backupName: backupName()
    }, conf);
    utils.callForAll(services, 'backup', backupConf);
};
