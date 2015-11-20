var utils = module.exports = {};

utils.error = function(callback, message) {
    if (callback) {
        callback(message);
    }
    else {
        console.error("ERROR: " + message);
    }
};
