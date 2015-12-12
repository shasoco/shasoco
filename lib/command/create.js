var cmd = module.exports = {};

// Export loaded modules for testability
var mods = cmd.mods = {
    shell: require('shelljs'),
    utils: require('../utils'),
    deploys: require('../deploys'),
    console: console,
    package: require('../../package.json')
};

cmd.defaults = {
    gitSshPort: 22,
    backupSftpPort: 23,
    httpPort: 80,
    httpsPort: 443,
    sslcertSelfSigned: true
};

cmd.register = function(program) {
    return program.command('create <deploy-id> <domain>', 'create a new deployment project')
};

cmd.registerFull = function(program) {
    return program.arguments('<deploy-id> <domain>')
        .option('-p, --http-port [PORT]',
                'Port to expose for http (default=' + cmd.defaults.httpPort + ')')
        .option('-P, --https-port [PORT]',
                'Port to expose for https (default=' + cmd.defaults.httpsPort + ')')
        .option('-S, --sslcert [CERT]',
                'SSL Certificate for HTTPS')
        .option('-c, --sslcert-self-signed [BOOL]',
                'Is SSL Certificate self-signed (default=' + (cmd.defaults.sslcertSelfSigned ? 'true' : 'false') + ')')
        .option('-s, --git-ssh-port [PORT]',
                'Port to expose for git+ssh (default=' + cmd.defaults.gitSshPort + ')')
};

cmd.action = function(options, cb) {

    var id = options.args[0];
    if (!id) {
        return mods.utils.error(cb, "<deploy-id> missing");
    }

    var domain = options.args[1];
    if (!domain) {
        return mods.utils.error(cb, "<domain> missing");
    }

    // parse SSL certificate: self-signed option
    if (options.sslcertSelfSigned === 'true') {
        options.sslcertselfsigned = true;
    }
    else if (options.sslcertSelfSigned === 'false') {
        options.sslcertselfsigned = false;
    }
    else {
        options.sslcertselfsigned = cmd.defaults.sslcertSelfSigned;
    }

    // generate SSL certificate data if necessary
    if (!options.sslcert) {
        mods.console.log("No SSL certificate provided. Generating a self-signed certificate.");
        options.sslcert = mods.utils.selfSignedCertificate();
        options.sslcertselfsigned = true;
    }

    // generate a project
    if (mods.deploys.exists(id)) {
        return mods.utils.error(cb, "deploy already exists");
    }
    var conf = mods.deploys.create(id, {
        domain: domain,
        httpPort: options.httpPort|| cmd.defaults.httpPort,
        httpsPort: options.httpsPort|| cmd.defaults.httpsPort,
        gitSshPort: options.gitSshPort || cmd.defaults.gitSshPort,
        backupSftpPort: options.backupSftpPort || cmd.defaults.backupSftpPort,
        sslcert: options.sslcert,
        sslcertselfsigned: options.sslcertselfsigned,
        version: mods.package.version
    });
};
