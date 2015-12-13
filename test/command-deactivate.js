var assert = require('assert');
var sinon = require('sinon');
var deactivate = require('../lib/command/deactivate');
var utils = require('../lib/utils.js');

var sampleConfig = require('./sample-config').myDeploy();

describe('Deactivate', function() {

    describe('#register()', function() {
        it('registers the "deactivate" command', function() {
            var command = sinon.spy();
            deactivate.register({ command: command });
            assert(command.calledWith('deactivate <domain>'));
        });
    });

    describe('#action()', function() {

        var errorStub, deactivateStub;
        beforeEach(function() {
            deactivateStub = sinon.stub(deactivate.mods.metaproxy, 'deactivate');
            errorStub = sinon.stub(deactivate.mods.utils, 'error');
        });
        afterEach(function() {
            errorStub.restore();
            deactivateStub.restore();
        });

        it('deactivates a domain', function() {
            deactivate.action({
                args: [ 'fovea.cc' ]
            });
            assert(!errorStub.called);
            assert(deactivateStub.calledWith('fovea.cc'));
        });
    });
});

