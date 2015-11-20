var package = require('../../package.json');

var cmd = module.exports = {};

cmd.defaults = {
};

cmd.register = function(program) {
    return program.command('ps', 'list running projects')
};

cmd.registerFull = function(program) {
    return cmd.register(program)
        .action(cmd.action);
};

cmd.action = function(options) {
};
