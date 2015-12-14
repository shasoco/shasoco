var service = module.exports = {};

service.name = "gitlab";
service.composeFile = "gitlab.yml";
service.computes = [ "gitlabpostgresql(15)", "gitlabredis", "gitlab(90)" ];
service.volumes = [
    "gitlabredisdata:/var/lib/redis",
    "gitlabpostgresqldata:/var/lib/postgresql",
    "gitlabdata:/home/git/data"
];
