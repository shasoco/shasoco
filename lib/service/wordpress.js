var service = module.exports = {};
var domains = require('../domains');
var sleep = require('../utils').sleep;

var composeUp = function(mode) {
    return function(conf) {
        var compose = domains.compose(conf);
        compose('up -d db');
        if (mode === 'deploy') {
            sleep(60000, 'Launching mysql');
        }
        compose('up -d --no-deps wordpress');
        sleep(1000, 'Launching wordpress');
    };
};

service.deploy = composeUp('deploy');

service.up = composeUp('up');

service.backup = function() {
};

service.restore = function() {
};

service.upgrade = function() {
};
