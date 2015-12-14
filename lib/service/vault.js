var service = module.exports = {};

var mods = service.mods = {
    deploys: require('../deploys'),
    utils: require('../utils')
};

service.composeFile = "vault.yml"
service.otherFiles = [ 'vault-nginx.conf' ];

service.up = function(conf) {
    var compose = mods.deploys.compose;
    compose(conf, 'up -d --no-deps vault');
};
