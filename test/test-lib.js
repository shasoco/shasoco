var lib = module.exports = {};

var assert = require('assert');
var sinon = require('sinon');

var package = require('../package.json');

lib.isADeployCommand = function(commandName, cmd) {

    var sampleConfig = require('./sample-config').myDeploy();

    describe('#register()', function() {
        it('should register the "' + commandName + '" command', function() {
            var command = sinon.spy();
            cmd.register({ command: command });
            assert(command.calledWith(commandName + ' <deploy-id>'));
        });
    });

    describe('#action()', function() {
        var errorStub,prepareStub;
        beforeEach(function() {
            errorStub = sinon.stub(cmd.mods.utils, 'error');
        });
        afterEach(function() {
            errorStub.restore();
        });

        it('requires a <deploy-id> argument', function() {
            cmd.action({ args: [] });
            assert(errorStub.called);
        });

        it('requires a config file', function() {
            var existsStub = sinon.stub(cmd.mods.deploys, 'exists');
            existsStub.returns(false);
            cmd.action({
                args: [ 'my-deploy' ]
            });
            assert(errorStub.called);
            existsStub.restore();
        });

        it('must use the same version as current deploy', function() {
            var safeLoad = sinon.stub(cmd.mods.deploys, 'safeLoad');
            safeLoad.returns(sampleConfig);
            cmd.action({
                args: [ sampleConfig.id ],
            }); 
            assert(errorStub.called);
            safeLoad.restore();
        });
    });
};
