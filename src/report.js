var dom = require('domquery');
var defaults = require('lodash/defaults');

/** report decorator for only calling the decorated report when a state has
    actually changed */
function lazyReport(report) {
    var elMap = {};

    return function(el, err) {
        if (elMap[el.name] !== undefined) {
            if (elMap[el.name] === err) {
                return; /* nothing new to report */
            }
        }

        elMap[el.name] = err;

        report(el, err);
    }
}

/** just log the incoming reports */
function logReport() {
    return function(el, err) {
        console.log(el, err);
    }
}

function chainReport(reports) {
    return function(el, err) {
        reports.forEach(function(report) {
            report(el, err);
        });
    }
}

/** does nothing */
function blackHoleReport() {
    return function(el, err) {}
}

/** updates an element form according to bootstrap semantics */
function bootstrapReport(config) {
    config = defaults(config || {}, {
        showSuccess: true,
        showError: true,
    });
    return function(el, isValid) {
        var parent = dom(el).parent('.form-group');

        if (!parent) {
            return;
        }

        if (isValid) {
            config.showSuccess && dom(parent).addClass('has-success');
            config.showError && dom(parent).removeClass('has-error');
        } else {
            config.showSuccess && dom(parent).removeClass('has-success');
            config.showError && dom(parent).addClass('has-error');
        }
    }
}

exports.lazyReport = lazyReport;
exports.bootstrapReport = bootstrapReport;
exports.blackHoleReport = blackHoleReport;
exports.logReport = logReport;
exports.chainReport = chainReport;
