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
    var backupID = options.args[1] || mods.backup.generateID();
    var force = options.force;
    var conf = mods.deploys.safeLoad(id);
    var backupConf = mods.backup.conf(conf, backupID);

    if (conf.version !== mods.package.version)
        return mods.utils.error(cb, "Domain isn't using the same version as the tool, use `shasoco version` to fix that");

    var tmpPath = backupConf.backupPath;
    var run = mods.backup.run(id);
    var finalPath = mods.deploys.path(conf.name) + "/backups";
    var finalTar = finalPath + "/" + backupID + ".tar.gz";

    // Extract the archive into tmpPath
    run("test -e " + finalTar);
    run("mkdir -p " + tmpPath);
    run("sh -c 'cd " + tmpPath + "; tar -xvzf " + finalTar + "'");

    // Check backup version number, validate configuration files
    var configData = run("cat " + tmpPath + "/config.yml").output;
    var newConfig = mods.yaml.safeLoad(configData);
    if (newConfig.version !== package.version)
        return mods.utils.error(cb, "Backup is using version " + newConfig.version + ", whereas we're running " + package.version);
    if (newConfig.name !== conf.name && !force)
        return mods.utils.error(cb, "Something isn't right: backup was created for deploy " + newConfig.name + ", use --force if you know what you're doing");
    var files = run("find " + tmpPath + " -maxdepth 1 -type f").output.split("\n");
    run("cp " + files.join(" ") + " " + mods.deploys.path(conf.name) + "/");

    // Call restore for each service
    mods.utils.callForAll(mods.services, 'restore', backupConf);

    // Cleanup tmpPath
    run("rm -rf " + tmpPath);
};
