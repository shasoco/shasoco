var up = require('../lib/command/up.js');
var assert = require('assert');
var sinon = require('sinon');

var package = require('../package.json');
var sampleConfig = require('./sample-config').myDeploy();

describe('Up', function() {

    describe('#register()', function() {
        it('should register the "up" command', function() {
            var command = sinon.spy();
            up.register({ command: command });
            assert(command.calledWith('up <deploy-id>'));
        });
    });

    describe('#action()', function() {
        var errorStub;
        beforeEach(function() {
            errorStub = sinon.stub(up.mods.utils, 'error');
        });
        afterEach(function() {
            errorStub.restore();
        });

        it('requires a <deploy-id> argument', function() {
            up.action({ args: [] });
            assert(errorStub.called);
        });

        it('requires a config file', function() {
            var existsStub = sinon.stub(up.mods.deploys, 'exists');
            existsStub.returns(false);
            up.action({
                args: [ 'my-deploy' ]
            });
            assert(errorStub.called);
            existsStub.restore();
        });

        it('must use the same version as current deploy', function() {
            var safeLoad = sinon.stub(up.mods.deploys, 'safeLoad');
            safeLoad.returns(sampleConfig);
            var saveStub = sinon.stub(up.mods.deploys, 'save');
            up.mods.services = [];
            up.action({
                args: [ sampleConfig.id ],
            }); 
            assert(errorStub.called);
            sampleConfig.version = package.version;
            up.action({
                args: [ sampleConfig.id ],
            }); 
            assert(errorStub.calledOnce);
            up.mods.services = require('../lib/services');
            saveStub.restore();
            safeLoad.restore();
        });
    });

});
