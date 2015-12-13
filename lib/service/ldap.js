var service = module.exports = {};

var mods = service.mods = {
    deploys: require('../deploys'),
    backup: require('../backup'),
    utils: require('../utils')
};

service.composeFile = "ldap.yml";

service.deploy = function(conf) {
    mods.deploys.compose(conf, 'up -d --no-deps ldap');
    mods.utils.sleep(10000, 'Preparing LDAP');
    mods.deploys.compose(conf, 'up -d --no-deps directory');
};

service.up = function(conf) {
    mods.deploys.compose(conf, 'up -d --no-deps ldap directory');
};

service.volumes = [{
    container: "ldapdata",
    volume: "/var/lib/ldap"
}];

service.backup = function(conf) {
    service.volumes.forEach(function(vol) {
        mods.backup.backupVolume(conf, "ldap", vol);
    });
};

service.restore = function(conf) {
    service.volumes.forEach(function(vol) {
        mods.backup.restoreVolume(conf, "ldap", vol);
    });
};
