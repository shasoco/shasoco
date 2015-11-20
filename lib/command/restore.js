var package = require('../../package.json');

var cmd = module.exports = {};

cmd.defaults = {
    'restore-backup': ''
};

cmd.register = function(program) {
    return program.command('restore <domain>', 'restore a backup')
};

cmd.registerFull = function(program) {
    return cmd.register(program)
        .option('--restore-backup [BACKUP_TGZ]',
                'Backup file deploy from')
        .action(cmd.action);
};

cmd.action = function(domain, options) {
};
