var commands = require('../lib/commands.js');
var assert = require('assert');

describe('Commands', function() {
    it('should expose all commands', function() {
        assert(commands.version);
        assert(commands.versions);
        assert(commands.create);
        assert(commands.prepare);
        assert(commands.deploy);
        assert(commands.ps);
        assert(commands.up);
        assert(commands.stop);
        assert(commands.upgrade);
        assert(commands.backup);
        assert(commands.restore);
        assert(commands.rm);
        assert(commands.activate);
        assert(commands.deactivate);
    });
});
