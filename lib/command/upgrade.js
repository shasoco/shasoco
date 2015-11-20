var package = require('../../package.json');

var cmd = module.exports = {};

cmd.defaults = {
    'version': package.version
};

cmd.register = function(program) {
    return program.command('upgrade <domain>', 'update services to a given shasoco version')
};

cmd.registerFull = function(program) {
    return cmd.register(program)
        .option('--upgrade-version [VERSION]',
                'Version number (default=' + cmd.defaults.version + ')')
        .action(cmd.action);
};

cmd.action = function(domain, options) {
};
