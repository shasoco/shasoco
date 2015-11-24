var utils = module.exports = {};
var shell = require('shelljs');

utils.error = function(callback, message) {
    if (callback) {
        callback(message);
    }
    else {
        console.error("ERROR: " + message);
    }
};

var padLeft = function(str, len) {
    if (!str)
        str = ''
    while (str.length < len)
        str = ' ' + str;
    return str;
};

utils.sleep = function(millis, title) {
    var ProgressBar = require('progress');
    var bar = new ProgressBar(padLeft(title, 24) + ' [:bar] :percent', {
        width: 20,
        incomplete: ' ',
        total: Math.ceil(millis / 1000)
    });
    while(!bar.complete) {
        bar.tick();
        shell.exec('sleep 1');
    };
};
