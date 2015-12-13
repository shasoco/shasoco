module.exports = {
    run: function(name, argv) {
        var cmd = require('../lib/commands')[name];
        var args = cmd.registerFull(require('commander')).parse(argv);
        cmd.action(args);
    },
    run2: function(name, argv) {
        var cmd = require('../lib/commands')[name];
        cmd.registerFull(require('commander')).parse(process.argv);
        if (process.argv.length === 2) {
            cmd.action();
        }
    }
};
