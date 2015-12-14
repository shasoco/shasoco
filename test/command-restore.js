var assert = require('assert');
var sinon = require('sinon');
var restore = require('../lib/command/restore');
var package = require('../package.json');
var sampleConfig = require('./sample-config').myDeploy();

describe('Restore', function() {

    describe('#register()', function() {
        it('should register the "restore" command', function() {
            var command = sinon.spy();
            restore.register({ command: command });
            assert(command.calledWith('restore <deploy-id> <backup-id>'));
        });
    });

    describe('#action()', function() {
        var errorStub, safeLoad, saveStub, prepareStub;
        beforeEach(function() {
            errorStub = sinon.stub(restore.mods.utils, 'error');
            safeLoad = sinon.stub(restore.mods.deploys, 'safeLoad');
            safeLoad.returns(sampleConfig);
            backupRun = sinon.stub(restore.mods.backup, 'run');
            backupRun.returns({
                output: "version: " + package.version + "\n" +
                        "domain: fovea.cc"
            });
            restore.mods.services = [];
            saveStub = sinon.stub(restore.mods.deploys, 'save');
            prepareStub = sinon.stub(restore.mods.deploys, 'prepare');
        });
        afterEach(function() {
            errorStub.restore();
            safeLoad.restore();
            backupRun.restore();
            restore.mods.services = require('../lib/services');
            saveStub.restore();
            prepareStub.restore();
        });

        it('requires a <deploy-id> argument', function() {
            restore.action({ args: [] });
            assert(errorStub.called);
        });

        it('requires a <backup-id> argument', function() {
            restore.action({ args: [ 'my-deploy' ] });
            assert(errorStub.called);
        });

        it('requires the deploy to use the same version as shasoco', function() {
            sampleConfig.version = '0.0.0';
            restore.action({ args: [ 'my-deploy' ] });
            assert(errorStub.called);
        });

        it('runs restores commands', function() {
            sampleConfig.version = package.version;
            restore.action({
                args: [ 'my-deploy', '0' ]
            });
            assert(!errorStub.called);
            assert(backupRun.called);
            assert(saveStub.called);
        });
    });
});
