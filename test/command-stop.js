var stop = require('../lib/command/stop.js');
var assert = require('assert');
var sinon = require('sinon');

var package = require('../package.json');
var sampleConfig = require('./sample-config').myDeploy();
sampleConfig.status = 'UP';

describe('Stop', function() {

    describe('#register()', function() {
        it('should register the "stop" command', function() {
            var command = sinon.spy();
            stop.register({ command: command });
            assert(command.calledWith('stop <deploy-id>'));
        });
    });

    describe('#action()', function() {
        var errorStub, compose;
        beforeEach(function() {
            errorStub = sinon.stub(stop.mods.utils, 'error');
            compose = sinon.stub(stop.mods.deploys, "compose");
        });
        afterEach(function() {
            errorStub.restore();
            compose.restore();
        });

        it('requires a <deploy-id> argument', function() {
            stop.action({ args: [] });
            assert(errorStub.called);
        });

        it('requires a config file', function() {
            var existsStub = sinon.stub(stop.mods.deploys, 'exists');
            existsStub.returns(false);
            stop.action({
                args: [ 'my-deploy' ]
            });
            assert(errorStub.called);
            existsStub.restore();
        });

        it('must use the same version as current deploy', function() {

            // stub
            var safeLoad = sinon.stub(stop.mods.deploys, 'safeLoad');
            safeLoad.returns(sampleConfig);
            var saveStub = sinon.stub(stop.mods.deploys, 'save');
            stop.mods.services = [];

            // execute  and check
            stop.action({
                args: [ sampleConfig.id ],
            }); 
            assert(errorStub.called);
            sampleConfig.version = package.version;
            stop.action({
                args: [ sampleConfig.id ],
            }); 
            assert(errorStub.calledOnce);
            assert(compose.calledOnce);

            // restore
            stop.mods.services = require('../lib/services');
            saveStub.restore();
            safeLoad.restore();
        });
    });

});
