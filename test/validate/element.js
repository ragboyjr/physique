var assert = require('assert');
var cmp = require('validate/cmp');
var element = require('validate/element');
var jsdom = require('jsdom').jsdom;

describe('Validate Element', function() {
    var el = jsdom('<input name="a" value="abc"/>').querySelector('input');
    var emptyEl = jsdom('<input name="b" value=""/>').querySelector('input');
    var checkedEl = jsdom('<input name="b" value="" checked="checked"/>').querySelector('input');

    describe('#length', function() {
        it('takes a comparator and validates an element length', function(done) {
            var v = element.length(cmp.eq(3));
            v(el, function(res) {
                done(assert(res));
            });
        });
    });
    describe('#notEmpty', function() {
        it('it validates true on text in element', function(done) {
            element.notEmpty()(el, function(res) {
                done(assert(res));
            });
        });
        it('it validates false on an empty value', function(done) {
            element.notEmpty()(emptyEl, function(res) {
                done(assert(!res));
            });
        });
    });
    describe('#regExp', function() {
        it('tests a regex against the element value', function(done) {
            element.regExp(/^a.?c$/)(el, function(res) {
                done(assert(res));
            });
        });
    });
    describe('#checked', function() {
        it('it validates that an element checked property', function(done) {
            element.checked()(checkedEl, function(res) {
                done(assert(res));
            });
        });
    });
    describe('#matches', function() {
        var form = jsdom('<form><input name="a" value="abc"/><input name="b" value="abc"/></form>')
            .querySelector('form');
        it('compares one element value to another', function(done) {
            element.matches(form, 'b')(form.elements['a'], function(res) {
                done(assert(res));
            });
        });
    });
});
