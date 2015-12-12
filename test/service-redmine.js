var assert = require('assert');
var sinon = require('sinon');
var redmine = require('../lib/service/redmine.js');
var utils = require('../lib/utils.js');

describe('Redmine', function() {

    var compose;
    before(function() {
        compose = sinon.stub(redmine.mods.deploys, "compose");
    });
    after(function() {
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
            redmine.backup({
                backupPath: "/test"
            });
            assert(utils.hasWords([ 'run', 'redminebackup', 'pg_dump' ],
                                  compose.lastCall.args[1]));
        });
    });

    describe('#restore()', function() {
        it('restores the database from redminebackup into postgresql', function() {
            redmine.restore({
                backupPath: "/test"
            });
            assert(utils.hasWords([ 'run', 'redminebackup', 'psql' ],
                                  compose.lastCall.args[1]));
        });
    });
});
