var assert = require('assert');
var cmp = require('validate/cmp');

describe('Validate Cmp', function() {
    describe('#lt', function() {
        it('compares that a value is less than', function() {
            assert(cmp.lt(5)(4));
        });
    });
    describe('#gt', function() {
        it('compares that a value is greater than', function() {
            assert(cmp.gt(5)(6));
        });
    });
});
