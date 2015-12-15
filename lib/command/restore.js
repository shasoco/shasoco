var cmd = module.exports = {};

var mods = cmd.mods = {
    package: require('../../package.json'),
    deploys: require('../deploys'),
    services: require('../services'),
    backup: require('../backup'),
    utils: require('../utils'),
    yaml: require('js-yaml')
};

cmd.register = function(program) {
    return program.command('restore <deploy-id> <backup-id>', 'restore a backup')
};

cmd.registerFull = function(program) {
    return program.arguments('<deploy-id> <backup-id>')
        .option('-f, --force',
                'Force the backup to be restored (unsafe)')
};

cmd.action = function(options, cb) {
    var id = options.args[0];
    if (!id)
        return mods.utils.error(cb, "<deploy-id> missing");

    var backupID = options.args[1];
    if (!backupID)
        return mods.utils.error(cb, "<backup-id> missing");

    var srcId = id;
    var ar = backupID.split("/");
    if (ar.length == 2) {
        srcId = ar[0];
        backupID = ar[1];
    }

    var force = options.force;
    var conf = mods.deploys.safeLoad(id);
    if (!conf)
        return mods.utils.error(cb, "can't load config file");

    if (conf.status === 'UP')
        return mods.utils.error(cb, "can't restore if deploy is " + conf.status);

    var backupConf = mods.backup.conf(conf, backupID);

    if (conf.version !== mods.package.version)
        return mods.utils.error(cb, "domain isn't using the same version as the tool, use `shasoco version` to fix that");

    var tmpPath = backupConf.backupPath;
    var run = mods.backup.run;
    var finalPath = mods.deploys.path(srcId) + "/backups";
    var finalTar = finalPath + "/" + backupID + ".tar.gz";

    // Prepare container
    mods.deploys.prepare(conf, mods.services);
    console.log("prepare container");
    var compose = mods.deploys.compose;
    compose(conf, 'up backup');

    // Extract the archive into tmpPath
    run(id, "test -e " + finalTar);
    run(id, "mkdir -p " + tmpPath);
    run(id, "sh -c 'cd " + tmpPath + "; tar -xzf " + finalTar + "'");

    // Check backup version number, validate configuration files
    var configData = run(id, "cat " + tmpPath + "/config.yml").output;
    var newConfig = mods.yaml.safeLoad(configData);
    if (newConfig.version !== mods.package.version)
        return mods.utils.error(cb, "Backup is using version " + newConfig.version + ", whereas we're running " + mods.package.version);
    if (newConfig.domain !== conf.domain && !force)
        return mods.utils.error(cb, "Something isn't right: backup was created for domain " + newConfig.domain + ", use --force if you know what you're doing");

    // Save the new config (with modified ID)
    newConfig.id = conf.id;
    mods.deploys.save(newConfig);

    // Compile the project's files
    mods.deploys.prepare(newConfig, mods.services);

    // Retrieve volumes
    var volumes = [];
    mods.services.forEach(function(s) {
        if (s.volumes) {
            s.volumes.forEach(function(c) {
                volumes.push({
                    service: s.name,
                    container: c.split(":")[0],
                    volume: c.split(":")[1]
                });
            });
        }
    });

    // Restore each
    volumes.forEach(function(vol) {
        compose(newConfig, 'up --no-recreate ' + vol.container);
        mods.backup.restoreVolume(backupConf, vol.service, vol);
    });

    // Cleanup tmpPath
    run(id, "rm -rf " + tmpPath);
};
