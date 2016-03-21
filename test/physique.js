var physiq = require('physique');
var jsdom = require('jsdom').jsdom;
var assert = require('assert');
var validator = physiq.validator;

describe('Physique', function() {
    describe('#validateForm', function() {
        var form = jsdom('<form><input name="a"/><input name="b"/></form>').querySelector('form');
        it('validates the elements of a form', function(done) {
            physiq.validateForm({
                a: validator(physiq.validateAlways()),
                b: validator(physiq.validateAlways())
            })(form, function(res) {
                assert(res == null);
                done();
            });
        });
        it('returns message if any fail', function(done) {
            physiq.validateForm({
                a: validator(physiq.validateAlways()),
                b: validator(physiq.not(physiq.validateAlways()), "error")
            })(form, function(res) {
                assert(res.b == "error");
                done();
            });
        });
    });
});
