var package = require('../../package.json');

var cmd = module.exports = {};

cmd.defaults = {
    'file': ''
};

cmd.register = function(program) {
    return program.command('backup <domain>', 'save a backup to disk')
};

cmd.registerFull = function(program) {
    return cmd.register(program)
        .option('--backup-file [BACKUP_TGZ]',
                'Backup file to save to')
        .action(cmd.action);
};

cmd.action = function(domain, options) {
};
