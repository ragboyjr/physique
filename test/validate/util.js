var assert = require('assert');
var util = require('validate/util');

describe('Validate Util', function() {
    describe('#identity', function() {
        it('returns the argument validated', function(done) {
            util.identity()('abc', function(res) {
                done(assert(res === 'abc'));
            });
        });
    });
    describe('#stub', function() {
        it('returns the same argument from creation', function(done) {
            util.stub('abc')('def', function(res) {
                done(assert(res === 'abc'));
            });
        });
    });
    describe('#always', function() {
        it('alias of stub(true)', function(done) {
            util.always()('def', function(res) {
                done(assert(res === true));
            });
        });
    });
    describe('#never', function() {
        it('alias of stub(false)', function(done) {
            util.never()('def', function(res) {
                done(assert(res === false));
            });
        });
    });
    describe('#not', function() {
        it('!\'s the result of a validator', function(done) {
            util.not(util.identity())(false, function(res) {
                done(assert(res));
            });
        });
    });
    describe('#map', function() {
        it('transforms the input of the validator', function(done) {
            function plusOne(a) {
                return a + 1;
            }

            util.map(util.identity(), plusOne)(1, function(res) {
                done(assert(res == 2));
            });
        });
    });
});
