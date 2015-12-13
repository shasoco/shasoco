var metaproxy = require('../lib/metaproxy');
var sinon = require('sinon');
var assert = require('assert');

describe('Metaproxy', function() {

    describe('#activate()', function() {

        it('starts the metaproxy', function() {
            var deactivate = sinon.stub(metaproxy, 'deactivate');
            var startContainer = sinon.stub();
            var createContainer = sinon.stub(metaproxy, 'createContainer');

            metaproxy.activate({
                id: 'my-deploy',
                domain: 'fovea.cc'
            });

            assert(deactivate.calledWith('fovea.cc'));
            deactivate.callArg(1);
            
            assert.equal(metaproxy.image, createContainer.firstCall.args[0].Image);
            assert.equal("shasoco_foveacc", createContainer.firstCall.args[0].name);
            createContainer.callArgWith(1, null, {
                start: startContainer
            });

            assert(startContainer.called);
            startContainer.callsArg(0);

            deactivate.restore();
            createContainer.restore();
        });
    });
});
