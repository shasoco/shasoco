var service = module.exports = {};

var mods = service.mods = {
    domains: require('../domains'),
    utils: require('../utils')
};

// 'deploy' is used to bring up the service for the first time
//
// If it isn't defined (because there's no special actions to perform on first deploy)
// then shasoco will use 'up' instead.
// service.deploy = function(conf) {
// };

// 'up' will bring the service up and running
//
// Under the hood, you'll probably use docker-compose up.
service.up = function(conf) {
    var compose = mods.domains.compose;
    compose(conf, 'up -d redminepostgresql redmine');
};

// 'down' will stop the stack and destroy pure compute services.
//
// Under the hood, you'll probably use docker-compose stop and rm.
service.down = function(conf) {
    //compose(conf, 'stop boilerplateservice');
    //compose(conf, 'rm -f boilerplateservice');
};

//
service.backup = function(conf) {
    var compose = mods.domains.compose;
    var outPath = conf.backupPath + '/redmine/';

    compose(conf, 'run -e PGPASSWORD=' + conf.rootpassword +
            ' --rm --no-deps redminebackup sh -c "' +
            // Backup the database
            ' pg_dump' +
            ' --username=redmine' +
            ' --host=postgresql' +
            ' --dbname=redmine_production' +
            ' --format=c' +
            ' > ' + outPath + '/database &&' +
            // Backup files
            ' cp -r /home/redmine/data ' + outPath + '/data' +
            '"');
};

service.restore = function(conf) {
    var compose = mods.domains.compose;
    var path = conf.backupPath + '/redmine/';
    compose(conf, 'run -e PGPASSWORD=' + conf.rootpassword +
            ' --rm --no-deps redminebackup sh -c "' +
            // Restore the database
            ' psql' +
            ' --host=postgresql' + 
            ' --username=redmine' +
            ' --dbname=redmine_production' +
            ' -f ' + path + '/database' +
            // Restore files
            ' cp -fr ' + path + '/data /home/redmine' +
            '"');
};

// Test if added feature X is already present on this deploy
//var hasFeatureX = utils.minVersion("0.0.1");

// Test if removed feature Y is still present on this deploy
//var hadFeatureY = utils.maxVersion("0.0.2");

// 'preUpgrade' is called before performing service upgrade
//
// Services are up and the old config is still active,
// it's a good place to cleanup removed features
service.preUpgrade = function(conf) {
    //if (hadFeatureY(conf.version))
    //    compose(conf, 'rm -f -v boilerplatefeaturey');
};

// 'upgrade' should perform upgrade specific actions
//
// Services are down you may like to hack into configuration
// files and settings, deploy new features, etc.
service.upgrade = function(conf) {
    //if (!hasFeatureX(conf.version)) {
    //    compose('up -d boilerplatefeaturex');
    //    utils.sleep(10000, 'Waiting for featureX');
    //}
};

// 'postUpgrade' is called after service upgrade
//
// Services are re-created and up again, the new config is active,
// it's a good place to run some upgrade scripts that required
// the stack to be up.
service.postUpgrade = function(conf) {
};
