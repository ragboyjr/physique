var assert = require('assert');
var cmp = require('validate/cmp');
var element = require('validate/element');
var jsdom = require('jsdom').jsdom;

describe('Validate Element', function() {
    var el = jsdom('<input name="a" value="abc"/>').querySelector('input');
    var emptyEl = jsdom('<input name="b" value=""/>').querySelector('input');

    describe('#validateLength', function() {
        it('takes a comparator and validates an element length', function(done) {
            var v = element.validateLength(cmp.eq(3));
            v(el, function(res) {
                done(assert(res));
            });
        });
    });
    describe('#validateNotEmpty', function() {
        it('it validates true on text in element', function(done) {
            element.validateNotEmpty()(el, function(res) {
                done(assert(res));
            });
        });
        it('it validates false on an empty value', function(done) {
            element.validateNotEmpty()(emptyEl, function(res) {
                done(assert(!res));
            });
        });
    });
    describe('#validateRegExp', function() {
        it('tests a regex against the element value', function(done) {
            element.validateRegExp(/^a.?c$/)(el, function(res) {
                done(assert(res));
            });
        });
    });
});
