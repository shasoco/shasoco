var service = module.exports = {};

var mods = service.mods = {
    deploys: require('../deploys'),
    backup: require('../backup'),
    utils: require('../utils')
};
var crypto = require('crypto');

service.name = "redmine";

service.composeFile = "redmine.yml";
service.otherFiles = [ 'redmine-init.sql' ];

service.computes = [
    "redminepostgresql",
    "redmine"
];

service.volumes = [{
    container: "redminedata",
    volume: "/home/redmine/data"
}, {
    container: "redminepostgresqldata",
    volume: "/var/lib/postgresql"
}];

var sha1 = function(str) {
    var s = crypto.createHash('sha1');
    s.update(str);
    s.end();
    return s.read().base64Slice();
};

service.deploy = function(conf) {
    var compose = mods.deploys.compose;
    service.up(conf);
    var hash = sha1(conf.salt + sha1(conf.adminpassword));
    var psql = ' psql ' +
      ' --host=postgresql' + 
      ' --username=redmine' +
      ' --dbname=redmine_production';
    compose(conf, 'run -e PGPASSWORD=' + conf.rootpassword +
            ' --rm --no-deps redminebackup sh -c "' +
            ' echo waiting for redmine db &&' +
            ' sleep 20 &&' +
            // Apply LDAP config
            psql + ' < /redmine-init.sql &&' +
            // Update admin password
            "echo update users set" +
                " hashed_password=\\'" + hash + "\\'," +
                " salt=\\'" + conf.salt + "\\'" +
                " where id=\\'1\\'\; | " + psql +
            '"');
};

service.up = function(conf) {
    var compose = mods.deploys.compose;
    compose(conf, 'up -d --no-deps redminepostgresql redmine');
};

/*
service.backup = function(conf) {
    var compose = mods.deploys.compose;
    var outPath = conf.backupPath + '/redmine';

    compose(conf, 'stop redmine');

    mods.backup.backupVolume(conf, "redmine", {
        container: "redminedata",
        volume: "/home/redmine/data"
    });

    compose(conf, 'run -e PGPASSWORD=' + conf.rootpassword +
            ' --rm --no-deps redminebackup sh -c "' +
            ' echo pg_dump &&' +
            // Backup the database
            ' pg_dump' +
            ' --username=redmine' +
            ' --host=postgresql' +
            ' --dbname=redmine_production' +
            ' --clean' +
            ' > ' + outPath + '/database &&' +
            ' echo pg_dump done' +
            '"');

    compose(conf, 'up -d --no-deps redmine');
};

service.restore = function(conf) {
    var compose = mods.deploys.compose;
    var path = conf.backupPath + '/redmine/';

    compose(conf, 'stop redmine');

    mods.backup.restoreVolume(conf, "redmine", {
        container: "redminedata",
        volume: "/home/redmine/data"
    });

    compose(conf, 'run -e PGPASSWORD=' + conf.rootpassword +
            ' --rm --no-deps redminebackup sh -c "' +
            ' echo psql &&' +
            // Restore the database
            ' psql ' +
            ' --host=postgresql' + 
            ' --username=redmine' +
            ' --dbname=redmine_production' +
            ' < ' + path + '/database &&' +
            ' echo psql done ' +
            '"');

    compose(conf, 'up -d --no-deps redmine');
};
*/
