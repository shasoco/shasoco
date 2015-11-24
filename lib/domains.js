var domains = module.exports = {};
var shell = require('shelljs');
var _ = require('lodash');
var yaml = require('js-yaml');
var crypto = require('crypto');

var SHASOCO_PROJ_DIR = process.env.HOME + "/.shasoco/domains";
var COMPOSE_DIR = __dirname + '/../compose';

var projectDir = function(name) {
    return SHASOCO_PROJ_DIR + "/" + name;
};

var projectFile = function(name) {
    return projectDir(name) + "/config.yml";
};

var exists = domains.exists = function(name) {
    return shell.test('-f', projectFile(name));
};

var genSalt = function() {
    return crypto.randomBytes(48).toString('hex');
};

var genPassword = function() {
    return crypto.randomBytes(8).toString('base64').substr(0,10).replace('/','!');
};

var compile = function(conf) {
    return function(filename) {
        _.template(shell.cat(COMPOSE_DIR + '/' + filename))(conf).to(projectDir(conf.name) + '/' + filename);
    };
};

var create = domains.create = function(name, options) {
    var conf = _.extend({ name:name }, options, {
        salt: genSalt(),
        rootpassword: genPassword(),
        adminpassword: genPassword()
    });
    save(conf);
    generateFiles(conf);
    return conf;
};

var generateFiles = function(conf) {
    shell.ls(COMPOSE_DIR).forEach(compile(conf));
};

var upgrade = domains.upgrade = generateFiles;

var save = domains.save = function(conf) {
    conf = _.extend({}, conf);
    delete conf.status; // status is computed, no need to save.
    shell.mkdir('-p', projectDir(conf.name));
    yaml.safeDump(conf).to(projectFile(conf.name));
};

var composeName = domains.composeName = function(name) {
    return name.replace(/\./g, '');
};

var isUp = function(name) {
    return shell.exec('docker ps', {silent:true}).output.indexOf(" " + composeName(name) + "_") >= 0;
};

var isStopped = function(name) {
    return shell.exec('docker ps -a', {silent:true}).output.indexOf(" " + composeName(name) + "_") >= 0;
};

var load = domains.load = function(name) {
    var conf = yaml.safeLoad(shell.cat(projectFile(name)));
    conf.status = isUp(name) ? 'UP' : isStopped(name) ? 'SAVED' : 'DOWN';
    return conf;
};

var remove = domains.remove = function(name) {
    // TODO
};

var list = domains.list = function() {
    return shell.ls(projectDir('')).map(load);
};

var compose = domains.compose = function(conf) {
    return function() {
        var cwd = shell.pwd();
        shell.cd(projectDir(conf.name));
        shell.exec('docker-compose ' + [].slice.apply(arguments).join(' '));
        shell.cd(cwd);
    };
};
