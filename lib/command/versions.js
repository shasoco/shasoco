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
    shell.exec('npm view shasoco versions');
};
