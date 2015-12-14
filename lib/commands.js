var commands = module.exports = {};

commands.version = require('./command/version');
commands.versions = require('./command/versions');
commands.create = require('./command/create');
commands.prepare = require('./command/prepare');
commands.ps = require('./command/ps');
commands.up = require('./command/up');
commands.stop = require('./command/stop');
commands.upgrade = require('./command/upgrade');
commands.backup = require('./command/backup');
commands.restore = require('./command/restore');
commands.rm = require('./command/rm');
commands.activate = require('./command/activate');
commands.deactivate = require('./command/deactivate');

commands.forEach = function(cb) {
    for (var key in commands) {
        if (commands.hasOwnProperty(key) && typeof commands[key] !== 'function') {
            cb(key, commands[key]);
        }
    }
};
