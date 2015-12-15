var service = module.exports = {};

var mods = service.mods = {
    shell: require('shelljs')
};

service.name = "vault";
service.composeFile = "vault.yml"
service.otherFiles = [ 'vault-nginx.conf' ];
service.computes = [ "vault" ];
service.volumes = [];

service.init = function(conf) {
    mods.shell.mkdir('-p', conf.vaultpath);
};
