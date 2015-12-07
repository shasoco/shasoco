var utils = module.exports = {};
var shell = require('shelljs');
var R = require('ramda');
var crypto = require('crypto');

utils.error = function(callback, message) {
    if (callback) {
        callback(message);
    }
    else {
        console.error("ERROR: " + message);
        console.trace();
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

// Call the same method with the same argument iteratively on all
// objects of the array.
utils.callForAll = function(array, methodName, arg) {
    array.forEach(function(el) {
        if (el[methodName]) {
            el[methodName].call(this, arg);
        }
    });
};

utils.selfSignedCertificate = function() {
    shell.exec("openssl req -x509 -newkey rsa:2048 -keyout /tmp/key.pem -out /tmp/ca.pem -days 1080 -nodes -subj '/CN=*/O=My Company Name LTD./C=US'");
    var KEY = shell.cat('/tmp/key.pem');
    var CERT = shell.cat('/tmp/ca.pem');
    return (KEY + CERT).replace(/\n/g, '\\n');
};

// Generate a random SALT, used by services that needs encryption.
// The SALT is then stored in the project's configuration file, allowing
// transparent migration of domains.
utils.genSalt = function() {
    return crypto.randomBytes(48).toString('hex');
};

// Generate a random 10 chars password.
utils.genPassword = function() {
    return crypto.randomBytes(8).toString('base64').substr(0,10).replace('/','!');
};

// Add a prefix to a string.
utils.addPrefix = R.curry(function(prefix, str) {
    return prefix + str;
});

// Turn an array of commands to a list of shell "&&" commands, with logs
utils.cmdSeq = function(cmds) {
    return cmds.map(function(c) {
        return 'echo ' + c + ' && ' + c;
    }).join(' && ');
};
