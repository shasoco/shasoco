var service = module.exports = {};
var compose = require('../domains').compose;

service.up = function(conf) {
    compose(conf, 'up -d --no-deps backupsftp');
};
