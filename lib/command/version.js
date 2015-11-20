var cmd = module.exports = {};

cmd.defaults = {};

cmd.register = function(program) {
    return program.command('version [VERSION]', 'get/set the active shasoco version')
};

cmd.registerFull = function(program) {
    return cmd.register(program)
        .action(cmd.action);
};

cmd.action = function(domain, options) {
    console.error("ERROR: the version command is a meta command managed by the shasoco entry script");
    process.exit(1);
};
