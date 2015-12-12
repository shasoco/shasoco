var service = module.exports = {};

var mods = service.mods = {
    deploys: require('../deploys')
};

service.composeFile = "backup.yml";

service.up = function(conf) {
    mods.deploys.compose(conf, 'up -d --no-deps backup');
};
