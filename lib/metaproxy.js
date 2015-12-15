var metaproxy = module.exports = {};

metaproxy.image = 'tutum/haproxy:0.2.1';

var mods = metaproxy.mods = {
    deploys: require('./deploys'),
    utils: require('./utils'),
    Docker: require('dockerode')
};

metaproxy.name = function(domain) {
    return 'shasoco_' + mods.deploys.composeName(domain);
};

metaproxy.deactivate = function(domain, cb) {
    var docker = new mods.Docker();
    var metaname = metaproxy.name(domain);

    docker.listContainers({ all:true }, function(err, containers) {
        console.log("looking for " + metaname);
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
    var cnamessh = mods.deploys.composeName(conf.id) + "_proxyssh_" + 1;
    return {
        Image: metaproxy.image,
        Links: [
          cname + ":" + cname,
          cnamessh + ":" + cnamessh
        ],
        PortBindings: {
            "80/tcp":  [{ HostPort: conf.httpPort + "/tcp" }],
            "443/tcp": [{ HostPort: conf.httpsPort + "/tcp" }],
            "22/tcp":  [{ HostPort: conf.gitSshPort + "/tcp" }]
        },
        ExposedPorts: {
            "80/tcp": {},
            "443/tcp": {},
            "22/tcp": {}
        },
        Env: [
          "MODE=tcp",
          "TIMEOUT=connect 10s, client 24h, server 24h"
        ],
        name: metaproxy.name(conf.domain)
    };
};

metaproxy.createContainer = function(conf, cb) {
    var docker = new mods.Docker();
    docker.createContainer(conf, cb);
};

metaproxy.activate = function(conf, cb) {
    var metaname = metaproxy.name(conf.domain);
    metaproxy.deactivate(conf.domain, function() {
        metaproxy.createContainer(metaproxy.containerConfig(conf), function(err, container) {
            if (err)
                return mods.utils.error(cb, "Failed to create the metaproxy: " + err);
            container.start(function (err, data) {
                if (err)
                    return mods.utils.error(cb, "Failed to start the metaproxy: " + err);
                if (cb) cb();
            });
        });
    });
};

metaproxy.inspect = function(domain, cb) {
    var docker = new mods.Docker();
    var metaname = 'shasoco_' + mods.deploys.composeName(domain);
    docker.listContainers(function(err, containers) {
        var found = false;
        if (!err) {
            containers.forEach(function(containerInfo) {
                if (containerInfo.Names.indexOf('/' + metaname) >= 0) {
                    found = true;
                    var container = docker.getContainer(containerInfo.Id); 
                    container.inspect(cb);
                }
            });
        }
        if(!found) {
            cb(new Error("metaproxy not found"));
        }
    });
};

// returns true if deploy is active
metaproxy.isActive = function(conf, cb) {
    var cname = mods.deploys.composeName(conf.id) + "_proxy_" + 1;
    var metaname = metaproxy.name(conf.domain);
    metaproxy.inspect(conf.domain, function(err, info) {
        if (err) return cb(err);
        if (!info) return cb();
        var links = info.HostConfig.Links;
        var expectedLink = '/' + cname + ':/' + metaname + '/' + cname;
        cb(null, (links && links.length > 0 && links[0] === expectedLink) ? info : null);
    });
};
