var package = require('../../package.json');

var cmd = module.exports = {};

cmd.defaults = {
    'port': 80,
    'version': package.version,
    'from-backup': ''
};

cmd.register = function(program) {
    return program.command('deploy <domain>', 'deploy a new infrastructure project')
};

cmd.registerFull = function(program) {
    return cmd.register(program)
        .option('--deploy-port [PORT]',
                'Port to expose (default=' + cmd.defaults.port + ')')
        .option('--deploy-version [VERSION]',
                'Version number (default=' + cmd.defaults.version + ')')
        .option('--deploy-backup [BACKUP_TGZ]',
                'Backup file deploy from')
        .action(cmd.action);
};

cmd.action = function(domain, options) {
};
