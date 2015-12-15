var backup = module.exports = {};

var mods = backup.mods = {
    deploys: require('./deploys'),
    shell: require('shelljs'),
    utils: require('./utils')
};

var R = require('ramda');
var _ = require('lodash');

backup.conf = function(conf, backupID) {
    return _.extend({
        backupID: backupID,
        backupPath: backup.tmpPath(backupID)
    }, conf)
};

// Run a command on a debian machine that has both the shasocodata container
// and the temporary backup container attached.
// shasocodata: /var/lib/shasoco
// backup: /shasoco-backup
backup.run = R.curry(function(name, cmd) {
    // console.log(name, cmd);
    return mods.shell.exec("docker run --rm " +
                "--volumes-from " + mods.deploys.composeName(name) + "_backup_1 " +
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

var serviceBackupRun = function(conf, service, volume, cmdArray) {
    var bname = mods.deploys.composeName(conf.id) + "_backup_1";
    var cname = mods.deploys.composeName(conf.id) + "_" + volume.container + "_1";
    var cmd = mods.utils.cmdSeq(cmdArray);
    return mods.shell.exec("docker run --rm " +
                "--volumes-from " + cname + " " +
                "--volumes-from " + bname + " " +
                "debian:jessie sh -c \"" + cmd + "\"");
};

var tarname = function(volumename) {
    return volumename.slice(1).replace(/\//g, '_') + ".tar";
};

// config: { id: ..., domain: ..., backupPath: ... }
// service: string
// volume: { container: ..., volume: ... }
backup.backupVolume = function(conf, service, volume) {
    var path = conf.backupPath + '/' + service;
    serviceBackupRun(conf, service, volume, [
        "cd /",
        "mkdir -p " + path,
        "tar cf " + path + "/" + tarname(volume.volume) + " " + volume.volume.slice(1)
    ]);
};

backup.restoreVolume = function(conf, service, volume) {
    var path = conf.backupPath + '/' + service;
    serviceBackupRun(conf, service, volume, [
        "cd /",
        "tar xf " + path + "/" + tarname(volume.volume)
    ]);
};

