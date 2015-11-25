var service = module.exports = {};
var domains = require('../domains');
var utils = require('../utils');

var installHectane = function() {
    console.log("ACTION REQUIRED: ADD THE HECTANE PLUGIN TO YOUR WORDPRESS INSTALL");
    // TODO: Install hectane using wp-cli?
};

var composeUp = function(mode) {
    return function(conf) {
        var compose = domains.compose(conf);
        compose('up -d wordpressdb wordpressmail');
        if (mode === 'deploy')
            utils.sleep(60000, 'Preparing mysql');
        compose('up -d --no-deps wordpress');
        utils.sleep(1000, 'Launching wordpress');
        if (mode === 'deploy')
            installHectane();
    };
};

service.deploy = composeUp('deploy');

service.up = composeUp('up');

service.down = function(conf) {
    domains.compose(conf, 'stop wordpress wordpressdb wordpressmail');
    domains.compose(conf, 'rm -f wordpress wordpressdb wordpressmail');
};

service.backup = function() {
};

service.restore = function() {
};

/*
var hadDb = utils.maxVersion("0.0.1");
var hasHectaneMail = utils.minVersion("0.0.2");
*/

service.preUpgrade = function(conf) {
    /*
    var compose = domains.compose(conf);

    if (hadDb(conf.version)) {
        compose('rm -f -v db');
    }
    */
};

service.upgrade = function(conf) {
    /*
    var compose = domains.compose(conf);

    // Upgrading from 0.0.1
    // Hectane was added.
    if (!hasHectaneMail(conf.version))
        installHectane();

    // TODO: We could run an wordpress upgrade using wp-cli
    if (hadDb(conf.version)) {
        compose('up -d wordpressdb');
        utils.sleep(60000, 'Preparing mysql');
    }
    */
};

