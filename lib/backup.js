var backup = module.exports = {};

var domains = require('./domains');

var R = require('ramda');
var shell = require('shelljs');

// Run a command on a debian machine that has both the shasocodata container
// and the temporary backup container attached.
// shasocodata: /var/lib/shasoco
// backup: /shasoco-backup
backup.run = R.curry(function(name, cmd) {
    shell.exec("docker run --rm " +
                "--volumes-from " + domains.composeName(name) + "_backup_1 " +
                "--volumes-from shasocodata " +
                "debian:jessie " + cmd);
});

// Returns the temporary path where backup will be
// created to / restored from by services.
backup.tmpPath = function(backupID) {
    return "/shasoco-backup/" + backupID;
};

// Generate a backup ID from date and time (default to current date).
// ID will contain only digits and _ characters.
backup.generateID = function(date) {
    date = date || new Date();
    return date.toISOString().
      replace(/T/, '_').
      replace(/\..+/, '').
      replace(/[:-]/g, '');
};

