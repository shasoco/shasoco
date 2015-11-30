var shell = require('shelljs');

var package = require('../../package.json');

var utils = require('../utils');
var domains = require('../domains');

var cmd = module.exports = {};

cmd.defaults = {
    httpPort: 80,
    httpsPort: 443,
    sslcertSelfSigned: true
};

cmd.register = function(program) {
    return program.command('deploy <domain>', 'deploy a new infrastructure project')
};

cmd.registerFull = function(program) {
    return program
        .arguments('<domain>')
        .option('-p, --http-port [PORT]',
                'Port to expose for http (default=' + cmd.defaults.httpPort + ')')
        .option('-P, --https-port [PORT]',
                'Port to expose for https (default=' + cmd.defaults.httpsPort + ')')
        .option('-S, --sslcert [CERT]',
                'SSL Certificate for HTTPS')
        .option('-s, --sslcert-self-signed [true|false]',
                'SSL Certificate for HTTPS (default=' + (cmd.defaults.sslcertSelfSigned ? 'true' : 'false') + ')')
        .option('-b, --backup [BACKUP_TGZ]',
                'Backup file deploy from');
};

cmd.action = function(options, cb) {

    // domain name
    var domain = options.args[0];
    if (!domain) {
        return utils.error(cb, "domain missing");
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
        console.log("No SSL certificate provided. Generating a self-signed certificate.");
        options.sslcert = utils.selfSignedCertificate();
        options.sslcertselfsigned = true;
    }

    // generate a project
    if (domains.exists(domain)) {
        return utils.error(cb, "domain already exists");
    }
    var conf = domains.create(domain, {
        httpPort: options.httpPort|| cmd.defaults.httpPort,
        httpsPort: options.httpsPort|| cmd.defaults.httpsPort,
        sslcert: options.sslcert,
        sslcertselfsigned: options.sslcertselfsigned,
        version: package.version
    });

    // start
    var services = require('../services');
    services.forEach(function(s) {
        if (s.deploy)
            s.deploy(conf);
        else
            s.up(conf);
    });

    // TODO: restore backup
};
