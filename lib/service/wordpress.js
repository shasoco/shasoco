var service = module.exports = {};
var domains = require('../domains');
var utils = require('../utils');
var R = require('ramda');

var installHectane = function() {
    console.log("ACTION REQUIRED: ADD THE HECTANE PLUGIN TO YOUR WORDPRESS INSTALL");
    // TODO: Install hectane using wp-cli?
};

var composeUp = R.curry(function(mode, conf) {
    var compose = domains.compose(conf);

    // Start subservice, wait for the database to be ready
    compose('up -d wordpressdb wordpressmail');

    // TODO: implement a smarter way with a mysql-client connection loop
    if (mode === 'deploy')
        utils.sleep(60000, 'Preparing mysql');

    // Start wordpress
    compose('up -d --no-deps wordpress');

    // Install required plugins
    // (after a little delay to be sure wordpress is up and running)
    if (mode === 'deploy') {
        utils.sleep(1000, 'Launching wordpress');
        installHectane();
    }
});

service.deploy = composeUp('deploy');
service.up     = composeUp('up');

service.backup = function() {
    // TODO
};

service.restore = function() {
    // TODO
};

// The below is kept here as an example of how we would do things
//var hadDb = utils.maxVersion("0.0.1");
//var hasHectaneMail = utils.minVersion("0.0.2");

service.preUpgrade = function(conf) {
    //var compose = domains.compose(conf);
    //if (hadDb(conf.version))
    //    compose('rm -f -v db');
};

service.upgrade = function(conf) {
    //var compose = domains.compose(conf);
    // Upgrading from 0.0.1
    // Hectane was added.
    //if (!hasHectaneMail(conf.version))
    //    installHectane();
    // We could run an wordpress upgrade using wp-cli
    //if (hadDb(conf.version)) {
    //    compose('up -d wordpressdb');
    //    utils.sleep(60000, 'Preparing mysql');
    //}
};
