var service = module.exports = {};

service.name = "vault";
service.composeFile = "vault.yml"
service.otherFiles = [ 'vault-nginx.conf' ];
service.computes = [ "vault" ];
service.volumes = [];
