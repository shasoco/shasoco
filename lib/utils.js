var utils = module.exports = {};
var shell = require('shelljs');
var R = require('ramda');

utils.error = function(callback, message) {
    if (callback) {
        callback(message);
    }
    else {
        console.error("ERROR: " + message);
        process.exit(1);
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

utils.minVersion = R.curry(function(min, ver) {
    var vMin = +min.replace(".", "00");
    var vCur = +ver.replace(".", "00");
    return vCur >= vMin;
});

utils.maxVersion = R.curry(function(max, ver) {
    return utils.minVersion(ver, max);
});

utils.callForAll = function(array, methodName, arg) {
    // Upgrade all services
    array.forEach(function(el) {
        if (el[methodName]) {
            el[methodName].call(this, arg);
        }
    });
};
