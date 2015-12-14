var service = module.exports = {};

service.name = "ldap";
service.composeFile = "ldap.yml";
service.computes = [ "ldap(10)", "directory" ];
service.volumes = [ "ldapdata:/var/lib/ldap" ];
