var ldap = require('../lib/service/ldap.js');
var sinon = require('sinon');
var assert = require('assert');
/*
describe('Ldap', function() {

    describe('#restore()', function() {

        it('restores the /var/lib/ldap volume', function() {
            var restoreVolume = sinon.stub(ldap.mods.backup, 'restoreVolume');
            var compose = sinon.stub(ldap.mods.deploys, 'compose');
            var conf = { id: 'v0.fovea.cc' };
            ldap.restore(conf);
            assert(restoreVolume.calledWith(conf, 'ldap', {
                container: 'ldapdata',
                volume: '/var/lib/ldap'
            }));
            restoreVolume.restore();
            compose.restore();
        });
    });
});
*/
