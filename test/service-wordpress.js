var assert = require('assert');
var sinon = require('sinon');
var wordpress = require('../lib/service/wordpress.js');
var utils = require('../lib/utils.js');
/*
describe('Wordpress', function() {

    var compose, sleep;
    beforeEach(function() {
        compose = sinon.stub(wordpress.mods.deploys, "compose");
        sleep = sinon.stub(wordpress.mods.utils, 'sleep');
        wordpress.mods.console = { log: sinon.spy() };
    });
    afterEach(function() {
        compose.restore();
        sleep.restore();
        wordpress.mods.console = console;
    });

    describe('#up()', function() {
        it('starts database, mail then wordpress', function() {
            wordpress.up({});
            assert(utils.hasWords(['up', 'wordpressdb'],
                                  compose.firstCall.args[1]));
            assert(utils.hasWords(['up', 'wordpressmail'],
                                  compose.firstCall.args[1]));
            assert(utils.hasWords(['up', 'wordpress'],
                                  compose.lastCall.args[1]));
        });

        it('runs in normal mode', function() {
            wordpress.up({});
            assert(!sleep.called);
        });
    });

    describe('#deploy()', function() {
        it('starts database, mail then wordpress', function() {
            wordpress.deploy({});
            assert(utils.hasWords(['up', 'wordpressdb'],
                                  compose.firstCall.args[1]));
            assert(utils.hasWords(['up', 'wordpressmail'],
                                  compose.firstCall.args[1]));
            assert(utils.hasWords(['up', 'wordpress'],
                                  compose.lastCall.args[1]));
        });

        it('runs in deploy mode', function() {
            wordpress.deploy({});
            assert(sleep.called);
        });
    });
});
*/
