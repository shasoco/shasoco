var assert = require('assert');
var sinon = require('sinon');
var ps = require('../lib/command/ps');

describe('ps', function() {

    describe('#register()', function() {
        it('should register the "ps" command', function() {
            var command = sinon.spy();
            ps.register({ command: command });
            assert(command.called);
            assert(command.calledWith('ps'));
        });
    });

    describe('#action()', function() {
        it('should log running domains', function() {
            ps.mods.console = { log: sinon.spy() };
            var list = function() {
                return [{ name: 'a', port: 80, version: 'b', status: 'UP' }];
            };
            ps.mods.domains = {
                list: list
            };
            ps.action();
            assert.equal(2, ps.mods.console.log.getCalls().length);
            var l0 = ps.mods.console.log.args[0][0];
            var l1 = ps.mods.console.log.args[1][0];
            assert(l0.match(/ *NAME *PORT *VERSION *STATUS/));
            assert(l1.match(/ *a *80 *b *UP/));
        });
    });
});

