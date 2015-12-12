var assert = require('assert');
var sinon = require('sinon');
var prepare = require('../lib/command/prepare');
var utils = require('../lib/utils.js');

var sampleConfig = require('./sample-config').myDeploy();

describe('prepare', function() {

    describe('#register()', function() {
        it('registers the "prepare" command', function() {
            var command = sinon.spy();
            prepare.register({ command: command });
            assert(command.calledWith('prepare <deploy-id>'));
        });
    });

    describe('#action()', function() {
        var errorStub;
        beforeEach(function() {
            errorStub = sinon.stub(prepare.mods.utils, 'error');
        });
        afterEach(function() {
            errorStub.restore();
        });

        it('requires a <deploy-id> argument', function() {
            prepare.action({ args: [] });
            assert(errorStub.called);
        });

        it('requires a config file', function() {
            var existsStub = sinon.stub(prepare.mods.deploys, 'exists');
            existsStub.returns(false);
            prepare.action({
                args: [ 'my-deploy' ]
            });
            assert(errorStub.called);
            existsStub.restore();
        });

        it('generates a docker-compose file', function() {
            var safeLoad = sinon.stub(prepare.mods.deploys, 'safeLoad');
            safeLoad.returns(sampleConfig);
            var saveTo = sinon.stub(prepare.mods.utils, 'saveTo');
            prepare.action({
                args: [ sampleConfig.id ],
                pull: false
            });
            assert(!errorStub.called);
            assert(saveTo.called);
            var dockerComposeYml = saveTo.firstCall.args[1];
            assert.equal('/var/lib/shasoco/deploys/my-deploy/docker-compose.yml',
                         saveTo.firstCall.args[0]);
            assert(utils.hasWords([ 'redmine', 'gitlab', 'wordpress', 'proxy', 'backup', 'ldap' ],
                                  dockerComposeYml));
            safeLoad.restore();
            saveTo.restore();
        });

        it('generates other files required by services', function() {
        });

        it('pull images by default', function() {
        });

        it('can be asked not to pull images', function() {
        });
    });
});

