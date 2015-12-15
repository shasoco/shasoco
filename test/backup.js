var backup = require('../lib/backup.js');
var sinon = require('sinon');
var assert = require('assert');

describe('Backup', function() {

    describe('#backupVolume(conf, service, volume)', function() {

        it('copies files to backup', function() {
            var exec = sinon.stub(backup.mods.shell, 'exec');
            backup.backupVolume({
                id: "v0.fovea.cc",
                backupPath: "/bak"
            }, "serv", {
                volume: "/var/lib/serv",
                container: "cont"
            });
            assert(exec.called);
            var cmd = exec.args[0][0];
            console.log(cmd);
            assert(cmd.indexOf(" mkdir -p /bak/serv ") >= 0);
            //assert(cmd.indexOf(" /var/lib/serv /bak/serv/var/lib ") >= 0);
            exec.restore();
        });
    });

    describe('#restoreVolume(conf, service, volume)', function() {

        it('copies files from backup', function() {
            var exec = sinon.stub(backup.mods.shell, 'exec');
            backup.restoreVolume({
                id: "v0.fovea.cc",
                backupPath: "/bak"
            }, "serv", {
                volume: "/var/lib/serv",
                container: "cont"
            });
            assert(exec.called);
            var cmd = exec.args[0][0];
            //assert(cmd.indexOf(" /bak/serv/var/lib/serv/* /var/lib/serv ") >= 0);
            exec.restore();
        });
    });
});
