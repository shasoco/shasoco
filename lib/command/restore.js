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

    var force = options.force;
    var conf = mods.deploys.safeLoad(id);
    if (!conf)
        return mods.utils.error(cb, "can't load config file");

    var backupConf = mods.backup.conf(conf, backupID);

    if (conf.version !== mods.package.version)
        return mods.utils.error(cb, "Domain isn't using the same version as the tool, use `shasoco version` to fix that");

    var tmpPath = backupConf.backupPath;
    var run = mods.backup.run;
    var finalPath = mods.deploys.path(conf.id) + "/backups";
    var finalTar = finalPath + "/" + backupID + ".tar.gz";

    // Extract the archive into tmpPath
    run(id, "test -e " + finalTar);
    run(id, "mkdir -p " + tmpPath);
    run(id, "sh -c 'cd " + tmpPath + "; tar -xvzf " + finalTar + "'");

    // Check backup version number, validate configuration files
    var configData = run(id, "cat " + tmpPath + "/config.yml").output;
    var newConfig = mods.yaml.safeLoad(configData);
    if (newConfig.version !== mods.package.version)
        return mods.utils.error(cb, "Backup is using version " + newConfig.version + ", whereas we're running " + mods.package.version);
    if (newConfig.domain !== conf.domain && !force)
        return mods.utils.error(cb, "Something isn't right: backup was created for domain " + newConfig.domain + ", use --force if you know what you're doing");
    var files = run(id, "find " + tmpPath + " -maxdepth 1 -type f").output.split("\n");
    run(id, "cp " + files.join(" ") + " " + mods.deploys.path(conf.id) + "/");

    // Call restore for each service
    mods.utils.callForAll(mods.services, 'restore', backupConf);

    // Cleanup tmpPath
    run(id, "rm -rf " + tmpPath);

    // Save the new config (with modified ID)
    newConfig.id = conf.id;
    mods.deploys.save(newConfig);
};
