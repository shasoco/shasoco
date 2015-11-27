var service = module.exports = {};
var compose = require('../domains').compose;
var sleep = require('../utils').sleep;

service.deploy = function(conf) {
    compose(conf, 'up -d --no-deps ldap');
    sleep(10000, 'Preparing LDAP');
    compose(conf, 'up -d --no-deps directory');
};

service.up = function(conf) {
    compose(conf, 'up -d --no-deps ldap directory');
};

service.backup = function() {
    // TODO: backup ldapdata volume /var/lib/ldap
};

service.restore = function() {
};
