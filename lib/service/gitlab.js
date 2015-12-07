var service = module.exports = {};
var compose = require('../domains').compose;
var dockerExec = require('../domains').dockerExec;
var sleep = require('../utils').sleep;
var cmdSeq = require('../utils').cmdSeq;

service.deploy = function(conf) {
    compose(conf, 'up -d --no-deps gitlabpostgresql gitlabredis');
    sleep(15000, 'Preparing GitLab DB');
    compose(conf, 'up -d --no-deps gitlab');
    sleep(90000, 'Preparing GitLab');
};

service.up = function(conf) {
    compose(conf, 'up -d --no-deps gitlabpostgresql gitlabredis');
    sleep(1500, 'Preparing GitLab DB');
    compose(conf, 'up -d --no-deps gitlab');
    sleep(15000, 'Preparing GitLab DB');
};

service.backup = function(conf) {

    console.log("backup gitlab");

    // Gitlab defines a rake task to take a backup of your gitlab installation.
    // The backup consists of all git repositories, uploaded files and as you
    // might expect, the sql database.
    //
    // Before taking a backup make sure the container is stopped and removed to
    // avoid container name conflicts.
    // compose(conf, 'stop gitlab');
    // compose(conf, 'rm -f gitlab');

    // Execute the rake task to create a backup.
    //
    // A backup will be created in the backups folder of the Data Store.
    // You can change the location of the backups using the GITLAB_BACKUP_DIR
    // configuration parameter.

    compose(conf, "run --rm --no-deps gitlab app:rake gitlab:backup:create");

    // dockerExec(conf, "gitlab", "sudo -u git -H bundle exec rake gitlab:backup:create RAILS_ENV=production");

    // Copy the backups to shasoco's backup folder
    var outPath = conf.backupPath + '/gitlab/';
    var backups = "/home/git/data/backups";
    compose(conf, "run --rm --no-deps gitlabbackup sh -c \"" + cmdSeq([
        "mkdir -p " + outPath,
        "mv " + backups + "/* " + outPath
    ]) + "\"");
};

service.restore = function(conf) {

    // Gitlab also defines a rake task to restore a backup.
    //
    // Before performing a restore make sure the container is stopped and removed
    // to avoid container name conflicts.
    compose(conf, "stop gitlab");

    // Copy the backups back from shasoco's backup folder
    var path = conf.backupPath + '/gitlab/';
    var backups = "/home/git/data/backups";
    compose(conf, "run --rm --no-deps gitlabbackup sh -c \"" + cmdSeq([
        "rm -fr " + backups + "/*",
        "cp " + path + "/* " + backups,
        "chmod a+r " + backups + "/*"
    ]) + "\"");

    // Find timestamp of the latest backup
    // We just list all files and assume they're ordered, which seems to be the case.
    // There could be some empty lines in the end, so we check to that as well.
    var backups = compose(conf, "run --rm --no-deps gitlabbackup ls " + path).output.split("\n");
    if (backups.dir < 1) {
        console.error("No GitLab backup to restore");
        return;
    }
    var last = backups.length - 1;
    while(last > 0 && !backups[last]) {
        last -= 1;
    }
    var timestamp = backups[last].split("_")[0];
    console.log("restoring gitlab backup: " + timestamp);

    // Execute the rake task to restore a backup.
    // force=yes prevents confirmation of rebuilding authorized_keys
    compose(conf, "run -e force=yes --rm --no-deps gitlab app:rake gitlab:backup:restore BACKUP=" + timestamp);

    // Start gitlab, reusing the last container
    compose(conf, 'up -d --no-deps --no-recreate gitlab');
};
