var package = require('../../package.json');

var cmd = module.exports = {};

cmd.defaults = {
};

cmd.register = function(program) {
    return program.command('stop <domain>', 'stop the servers, do not destroy data')
};

cmd.registerFull = function(program) {
    return cmd.register(program)
        .action(cmd.action);
};

cmd.action = function(domain, options) {
};
