var service = module.exports = {};

var mods = service.mods = {
    deploys: require('../deploys'),
    utils: require('../utils')
};

var compose = function(conf, args) {
    mods.deploys.compose(conf)(args);
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
    //compose(conf, 'up -d boilerplateservice');
};

// 'down' will stop the stack and destroy pure compute services.
//
// Under the hood, you'll probably use docker-compose stop and rm.
service.down = function(conf) {
    //compose(conf, 'stop boilerplateservice');
    //compose(conf, 'rm -f boilerplateservice');
};

//
service.backup = function() {
};

service.restore = function() {
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
