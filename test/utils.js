var assert = require('assert');
describe('utils', function() {
    describe('#error()', function () {
        it('should return call the error callback if present', function () {
            var ret;
            utils.error(function(err) { ret = err; }, '123456');
            assert.equal('123456', ret);
        });
    });
});
