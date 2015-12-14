var assert = require('assert');
var sinon = require('sinon');
var redmine = require('../lib/service/redmine.js');
var utils = require('../lib/utils.js');
/*
describe('Redmine', function() {

    var compose;
    beforeEach(function() {
        compose = sinon.stub(redmine.mods.deploys, "compose");
    });
    afterEach(function() {
        compose.restore();
    });

    describe('#up()', function() {
        it('starts postgresql and redmine', function() {
            redmine.up({});
            assert(utils.hasWords(['up', 'redminepostgresql'],
                                  compose.lastCall.args[1]));
            assert(utils.hasWords(['up', 'redmine'],
                                  compose.lastCall.args[1]));
        });
    });

    describe('#backup()', function() {
        it('dumps the database using redminebackup', function() {
            var backupVolume = sinon.stub(redmine.mods.backup, 'backupVolume');
            redmine.backup({
                backupPath: "/test"
            });
            assert(utils.hasWords([ 'run', 'redminebackup', 'pg_dump' ],
                                  compose.args[1][1]));
            assert(backupVolume.called);
            backupVolume.restore();
        });
    });

    describe('#restore()', function() {
        it('restores the database from redminebackup into postgresql', function() {
            var restoreVolume = sinon.stub(redmine.mods.backup, 'restoreVolume');
            redmine.restore({
                backupPath: "/test"
            });
            assert(utils.hasWords([ 'run', 'redminebackup', 'psql' ],
                                  compose.secondCall.args[1]));
            assert(restoreVolume.called);
            restoreVolume.restore();
        });
    });
});
*/
