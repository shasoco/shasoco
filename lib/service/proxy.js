var service = module.exports = {};
var compose = require('../domains').compose;

service.up = function(conf) {
    compose(conf, 'up -d --no-deps proxy');
};

service.down = function(conf) {
    compose(conf, 'stop proxy');
    compose(conf, 'rm -f -v proxy');
};
