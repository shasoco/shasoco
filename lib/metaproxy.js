var metaproxy = module.exports = {};

metaproxy.image = 'tutum/haproxy:0.2.1';

var mods = metaproxy.mods = {
    deploys: require('./deploys'),
    utils: require('./utils'),
    Docker: require('dockerode')
};

metaproxy.deactivate = function(domain, cb) {
    var docker = new mods.Docker();
    var metaname = 'shasoco_' + mods.deploys.composeName(domain);

    docker.listContainers(function(err, containers) {
        var stopped = false;
        containers.forEach(function(containerInfo) {
            if (containerInfo.Names.indexOf('/' + metaname) >= 0) {
                stopped = true;
                docker.getContainer(containerInfo.Id).stop(function() {
                    docker.getContainer(containerInfo.Id).remove(cb);
                });
            }
        });
        if (!stopped) {
            if (cb) cb();
        }
    });
};

metaproxy.containerConfig = function(conf) {
    var cname = mods.deploys.composeName(conf.id) + "_proxy_" + 1;
    return {
        Image: metaproxy.image,
        Links: [ cname + ":" + cname ],
        PortBindings: {
            "80/tcp": [{ HostPort: conf.httpPort + "/tcp" }],
            "443/tcp": [{ HostPort: conf.httpsPort + "/tcp" }],
            "22/tcp": [{ HostPort: conf.gitSshPort + "/tcp" }]
        },
        ExposedPorts: {
            "80/tcp": {},
            "443/tcp": {},
            "22/tcp": {}
        },
        Env: [ "MODE=tcp" ],
        name: metaname
    };
};

metaproxy.activate = function(conf, cb) {
    var metaname = 'shasoco_' + mods.deploys.composeName(conf.domain);
    metaproxy.deactivate(conf.domain, function() {
        var docker = new mods.Docker();
        docker.createContainer(metaproxy.containerConfig, function (err, container) {
            if (err) {
                return mods.utils.error(cb, "failed to create the metaproxy: " + err);
            }
            container.start(function (err, data) {
                if (cb) cb();
            });
        });
    });
};
