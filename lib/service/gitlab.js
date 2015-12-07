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
    // Gitlab defines a rake task to take a backup of your gitlab installation. The backup consists of all git repositories, uploaded files and as you might expect, the sql database.
    //
    // Before taking a backup make sure the container is stopped and removed to avoid container name conflicts.
    //
    // docker stop gitlab && docker rm gitlab
    // Execute the rake task to create a backup.
    //
    // docker run --name gitlab -it --rm [OPTIONS] \
    //     sameersbn/gitlab:8.2.2 app:rake gitlab:backup:create
    //     A backup will be created in the backups folder of the Data Store. You can change the location of the backups using the GITLAB_BACKUP_DIR configuration parameter.
    //
    //
};

service.restore = function() {
    // stop gitlab, copy to volumes
};
