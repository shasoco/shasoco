var commands = module.exports = {};

commands.version = require('./command/version');
commands.versions = require('./command/versions');
commands.deploy = require('./command/deploy');
commands.ps = require('./command/ps');
commands.upgrade = require('./command/upgrade');
commands.backup = require('./command/backup');
commands.restore = require('./command/restore');
commands.stop = require('./command/stop');
commands.rm = require('./command/rm');

commands.forEach = function(cb) {
    for (var key in commands) {
        if (commands.hasOwnProperty(key) && typeof commands[key] !== 'function') {
            cb(key, commands[key]);
        }
    }
};
