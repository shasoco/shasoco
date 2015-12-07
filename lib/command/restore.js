var package = require('../../package.json');

var cmd = module.exports = {};

cmd.register = function(program) {
    return program.command('restore <domain> <backupID>', 'restore a backup')
};

cmd.registerFull = function(program) {
    return program.arguments('<domain> <backupID>');
};

cmd.action = function(domain, options) {
};
