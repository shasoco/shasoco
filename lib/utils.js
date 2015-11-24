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

var padString = function(transform) {
    return function(str, len) {
        if (typeof str === 'undefined')
            str = '';
        if (typeof str !== 'string')
            str = '' + str;
        while (str.length < len)
            str = transform(str);
        return str;
    };
};

var padRight = utils.padRight = padString(function(str) {
    return str + ' ';
});

var padLeft = utils.padLeft = padString(function(str) {
    return ' ' + str;
});

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

utils.minVersion = function(min) {
    return function(ver) {
        var vMin = +min.replace(".", "00");
        var vCur = +ver.replace(".", "00");
        return vCur >= vMin;
    };
};
