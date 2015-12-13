var assert = require('assert');
var sinon = require('sinon');
var create = require('../lib/command/create');

describe('Create', function() {

    describe('#register()', function() {
        it('should register the "create" command', function() {
            var command = sinon.spy();
            create.register({ command: command });
            assert(command.calledWith('create <deploy-id> <domain>'));
        });
    });

    describe('#action()', function() {
        var errorStub;
        var createStub;
        var existsStub;
        var selfSignedStub;
        beforeEach(function() {
            errorStub = sinon.stub(create.mods.utils, 'error');
            createStub = sinon.stub(create.mods.deploys, 'create');
            existsStub = sinon.stub(create.mods.deploys, 'exists');
            create.mods.console = { log: function(){} };
            selfSignedStub = sinon.stub(create.mods.utils, 'selfSignedCertificate');
            selfSignedStub.returns('fake-certificate');
        });
        afterEach(function() {
            errorStub.restore();
            existsStub.restore();
            createStub.restore();
            create.mods.console = console;
            selfSignedStub.restore();
        });
        it('requires a <deploy-id> argument', function() {
            create.action({ args: [] });
            assert(errorStub.called);
        });
        it('requires a <domain> argument', function() {
            create.action({ args: [ 'my-deploy' ] });
            assert(errorStub.called);
        });
        it('do not erase existing config file', function() {
            existsStub.returns(true);
            create.action({
                args: [ 'my-deploy', 'fovea.cc' ]
            });
            assert(errorStub.called);
        });
        it('create a config file', function() {
            existsStub.returns(false);
            create.action({
                args: [ 'my-deploy', 'fovea.cc' ]
            }, function(){});
            assert(!errorStub.called);
            assert(createStub.called);
            assert(createStub.firstCall.args[0] == 'my-deploy');
            assert(createStub.firstCall.args[1].domain == 'fovea.cc');
            assert(selfSignedStub.called);
            assert(createStub.firstCall.args[1].sslcert == 'fake-certificate');
        });
        it('allows to specify a ssl certificate', function() {
            existsStub.returns(false);
            create.action({
                args: [ 'my-deploy', 'fovea.cc' ],
                sslcert: 'my-cert'
            }, function(){});
            assert(!selfSignedStub.called);
            assert(!errorStub.called);
            assert(createStub.called);
        });
    });
});
