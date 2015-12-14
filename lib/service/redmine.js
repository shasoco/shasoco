var service = module.exports = {};

var mods = service.mods = {
    deploys: require('../deploys'),
    crypto: require('crypto')
};

service.name = "redmine";
service.composeFile = "redmine.yml";
service.otherFiles = [ 'redmine-init.sql' ];
service.computes = [ "redminepostgresql", "redmine(20)" ];
service.volumes = [
    "redminedata:/home/redmine/data",
    "redminepostgresqldata:/var/lib/postgresql"
];

var sha1 = function(str) {
    var s = mods.crypto.createHash('sha1');
    s.update(str);
    s.end();
    return s.read().base64Slice();
};

service.init = function(conf) {
    var compose = function(conf, cmd){
        console.log(cmd);
        mods.deploys.compose(conf, cmd);
    };
    var salt = conf.salt.slice(0, 64);
    var hash = sha1(salt + sha1(conf.adminpassword));
    var psql = ' psql ' +
      ' --host=postgresql' + 
      ' --username=redmine' +
      ' --dbname=redmine_production';
    compose(conf, 'run -e PGPASSWORD=' + conf.rootpassword +
            ' --rm --no-deps redminebackup sh -c "' +
            // Apply LDAP config
            psql + ' < /redmine-init.sql &&' +
            // Update admin password
            "echo update users set" +
                " hashed_password=\\'" + hash + "\\'," +
                " salt=\\'" + salt + "\\'" +
                " where id=\\'1\\' | " + psql +
            '"');
};
