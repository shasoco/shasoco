var deploys = require('../lib/deploys.js');
var assert = require('assert');
var sinon = require('sinon');

describe('Deploys', function() {

    describe('#path(id)', function() {
        it('returns the path to a deploy', function() {
            assert.equal('/var/lib/shasoco/deploys/test', deploys.path('test'));
        });
    });

    describe('#configPath(id)', function() {
        it('returns the path to a deploy\'s config file', function() {
            assert.equal('/var/lib/shasoco/deploys/test/config.yml', deploys.configPath('test'));
        });
    });

    describe('#exists(id)', function() {
        it('checks that the project\'s config file exists', function() {
            var stub = sinon.stub(deploys.mods.shell, 'test');
            stub.onFirstCall().returns(true);
            stub.onSecondCall().returns(false);
            assert(deploys.exists('whatever'));
            assert(!deploys.exists('whatever'));
            stub.restore();
        });
    });
});
