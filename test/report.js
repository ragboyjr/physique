var assert = require('assert');
var report = require('report');

describe('Report', function() {
    describe('#lazy', function() {
        var callCount = 0;
        function countReport(el, err) {
            callCount++;
        }

        it('reports on new statuses', function() {
            callCount = 0;

            report.lazy(countReport)({name:"a"}, null);
            assert(callCount == 1);
        });
        it('does not report on old statuses', function() {
            callCount = 0;
            var lazy = report.lazy(countReport);

            lazy({name:"a"}, null);
            lazy({name:"a"}, null);
            assert(callCount == 1);
        });
        it('report on changed statuses', function() {
            callCount = 0;
            var lazy = report.lazy(countReport);

            lazy({name:"a"}, null);
            lazy({name:"a"}, 'message');
            assert(callCount == 2);
        });
    });
    describe('#blackHole', function() {
        it('does nothing', function() {
            report.blackHole()(null, null);
            assert(true);
        });
    });
    describe('#chain', function() {
        it('runs multiple reports sequentially', function() {
            var count = 0;
            function countReport() {
                count++;
            }
            report.chain([countReport, countReport])(null, null);
            assert(count == 2);
        })
    });
});
