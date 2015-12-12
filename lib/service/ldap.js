var service = module.exports = {};

var mods = service.mods = {
    deploys: require('../deploys'),
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

service.backup = function() {
    // TODO: backup ldapdata volume /var/lib/ldap
};

service.restore = function() {
};
