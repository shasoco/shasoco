var inspect = require('../lib/command/inspect');
var testLib = require('./test-lib');
var sinon = require('sinon');
var assert = require('assert');
var package = require('../package.json');

describe('Inspect', function() {
    testLib.isADeployCommand('inspect', inspect);

    describe('#action', function() {
        it('shows deploy information', function(){

            // Setup stubs
            var sampleConfig = require('./sample-config').myDeploy();
            var safeLoad = sinon.stub(inspect.mods.deploys, 'safeLoad');
            sampleConfig.version = package.version;
            safeLoad.returns(sampleConfig);
            var dir = sinon.stub();
            inspect.mods.console = { dir: dir };

            // Test
            inspect.action({
                args: [ sampleConfig.id ]
            });
            assert(dir.calledWithMatch({
                id: sampleConfig.id,
                domain: sampleConfig.domain,
                adminpassword: sampleConfig.adminpassword
            }));

            // Cleanup stubs
            safeLoad.restore();
            inspect.mods.console = console;
        });
    });
});
