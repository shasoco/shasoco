var package = require('../../package.json');

var cmd = module.exports = {};

cmd.defaults = {
};

cmd.register = function(program) {
    return program.command('rm <domain>', 'delete all data, but not the backups!')
};

cmd.registerFull = function(program) {
    return cmd.register(program)
        .action(cmd.action);
};

cmd.action = function(domain, options) {
};
