var assert = require('assert');
var services = require('../lib/services.js');

describe('Services', function() {
    it('should expose all services', function() {
        assert.equal(6, services.length);
    });
});
