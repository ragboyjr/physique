var assert = require('assert');
var jsdom = require('jsdom').jsdom;
var html = require('html');

describe('Html', function() {
    describe('#findParent', function() {
        var child = jsdom('<div class="a"><div class="b"><div class="c"></div></div></div>').querySelector('.c');
        it('finds a parent based off of a criteria', function() {
            var parent = html.findParent(child, function(el) {
                return html.hasClass(el, 'a');
            });
            assert(parent.getAttribute('class') == 'a');
        });
        it('returns null when not found', function() {
            var parent = html.findParent(child, function(el) {
                return html.hasClass(el, 'q');
            });
            assert(!parent);
        });
    });
    describe('#hasClass', function() {
        function MockElement(cls) {
            this.cls = cls;
        }

        MockElement.prototype = {
            getAttribute: function(name) {
                if (name == 'class') {
                    return this.cls;
                }
            }
        };
        function el(cls) {
            return new MockElement(cls);
        }

        it('matches one class', function() {
            assert(html.hasClass(el('abc'), 'abc'));
        });
        it('does not match on different values', function() {
            assert(html.hasClass(el('a'), 'a'));
        });
        it('matches a first class', function() {
            assert(html.hasClass(el('abc def'), 'abc'));
        });
        it('matches a last class', function() {
            assert(html.hasClass(el('abc def'), 'def'));
        });
        it('matches a middle class', function() {
            assert(html.hasClass(el('abc def ghi'), 'def'));
        });
        it('does not make a partial match', function() {
            assert(!html.hasClass(el('abc def'), 'bc'));
        });
    });
    describe('#addClass', function() {
        function element(cls) {
            var el = jsdom('<div class="' + cls + '"></div>').querySelector('div');
            return el;
        }

        it('adds a class to an empty set', function() {
            var el = element('');
            html.addClass(el, 'a');
            assert(el.getAttribute('class') == 'a');
        });
        it('does not add a class if already there', function() {
            var el = element('a');
            html.addClass(el, 'a');
            assert(el.getAttribute('class') == 'a');
        });
        it('adds a class to a set', function() {
            var el = element('a b c');
            html.addClass(el, 'd');
            assert(el.getAttribute('class') == 'a b c d');
        });
    });
    describe('#removeClass', function() {
        function element(cls) {
            var el = jsdom('<div class="' + cls + '"></div>').querySelector('div');
            return el;
        }

        it('removes a class', function() {
            var el = element('a');
            html.removeClass(el, 'a');
            assert(el.getAttribute('class') == '');
        });
        it('does not remove a class if not there', function() {
            var el = element('a');
            html.removeClass(el, 'b');
            assert(el.getAttribute('class') == 'a');
        });
    });
});
