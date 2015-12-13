var assert = require('assert');
var sinon = require('sinon');
var backup = require('../lib/command/backup');
var package = require('../package.json');
var sampleConfig = require('./sample-config').myDeploy();

describe('Backup', function() {

    describe('#register()', function() {
        it('should register the "backup" command', function() {
            var command = sinon.spy();
            backup.register({ command: command });
            assert(command.calledWith('backup <deploy-id> <backup-id>'));
        });
    });

    describe('#action()', function() {
        var errorStub, safeLoad;
        beforeEach(function() {
            errorStub = sinon.stub(backup.mods.utils, 'error');
            safeLoad = sinon.stub(backup.mods.deploys, 'safeLoad');
            safeLoad.returns(sampleConfig);
            backupRun = sinon.stub(backup.mods.backup, 'run');
            backup.mods.services = [];
        });
        afterEach(function() {
            errorStub.restore();
            safeLoad.restore();
            backupRun.restore();
            backup.mods.services = require('../lib/services');
        });

        it('requires a <deploy-id> argument', function() {
            backup.action({ args: [] });
            assert(errorStub.called);
        });

        it('requires the deploy to use the same version as shasoco', function() {
            sampleConfig.version = '0.0.0';
            backup.action({ args: [ 'my-deploy' ] });
            assert(errorStub.called);
        });

        it('runs backups commands', function() {
            sampleConfig.version = package.version;
            backup.action({
                args: [ 'my-deploy' ]
            });
            assert(!errorStub.called);
            assert(backupRun.called);
        });
    });
});
