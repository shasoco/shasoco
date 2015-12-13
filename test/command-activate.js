var assert = require('assert');
var sinon = require('sinon');
var activate = require('../lib/command/activate');
var utils = require('../lib/utils.js');

var sampleConfig = require('./sample-config').myDeploy();

describe('Activate', function() {

    describe('#register()', function() {
        it('registers the "activate" command', function() {
            var command = sinon.spy();
            activate.register({ command: command });
            assert(command.calledWith('activate <deploy-id>'));
        });
    });

    describe('#action()', function() {

        var errorStub, safeLoad, activateStub;
        beforeEach(function() {
            activateStub = sinon.stub(activate.mods.metaproxy, 'activate');
            safeLoad = sinon.stub(activate.mods.deploys, 'safeLoad');
            safeLoad.returns(sampleConfig);
            errorStub = sinon.stub(activate.mods.utils, 'error');
        });
        afterEach(function() {
            safeLoad.restore();
            errorStub.restore();
            activateStub.restore();
        });

        it('requires the deploy to be UP', function() {
            sampleConfig.status = 'NEW';
            activate.action({
                args: [ sampleConfig.id ]
            });
            assert(errorStub.called);
        });

        it('activates a deploy', function() {
            sampleConfig.status = 'UP';
            activate.action({
                args: [ sampleConfig.id ]
            });
            assert(!errorStub.called);
            assert(activateStub.calledWith(sampleConfig));
        });
    });
});
