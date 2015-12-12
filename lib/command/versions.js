var cmd = module.exports = {};
var shell = require('shelljs');

cmd.defaults = {};

cmd.register = function(program) {
    return program.command('versions', 'list available shasoco versions')
};

cmd.registerFull = function(program) {
    return program;
};

cmd.action = function() {
    // TODO: Use docker API to find out available tags
    shell.exec('npm view shasoco versions');
};
