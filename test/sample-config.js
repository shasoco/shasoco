var _ = require('lodash');
module.exports = {
    myDeploy: function() {
        return {
            id: 'my-deploy',
            domain: 'fovea.cc',
            vaultpath: '/var/lib/shasoco/fovea.cc/vault',
            sslcert: 'fake-cert',
            sslcertselfsigned: true,
            salt: 'salt',
            rootpassword: '123456',
            adminpassword: '7890',
            httpsPort: 443,
            httpPort: 80,
            gitSshPort: 22,
            version: '0.0.0'
        }
    }
};
