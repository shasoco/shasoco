var service = module.exports = {};
var compose = require('../domains').compose;
var sleep = require('../utils').sleep;

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

service.backup = function() {
    // TODO: backup volumes
    // https://github.com/sameersbn/docker-gitlab#creating-backups
};

service.restore = function() {
    // stop gitlab, copy to volumes
};
