/* Reports are what do any of the validation reporting and UI updating. */
var html = require('./html');

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

function getParentErrorElement(document, parent, create) {
    var el = parent.querySelector('[data-physique-error]');
    if (el) {
        return el;
    }

    var el = document.createElement('span');
    el.setAttribute('class', 'help-block');
    el.setAttribute('data-physique-error', '');

    parent.appendChild(el);

    return el;
}

function updateErrorMessage(document, parent, err) {
    if (!document) {
        return;
    }

    if (err) {
        getParentErrorElement(document, parent, true).textContent = err;
        return;
    }

    /* either remove the element or do nothing */
    var el = getParentErrorElement(document, parent, false);
    if (!el) {
        return;
    }

    el.parentNode.removeChild(el);
}

/** updates an element form according to bootstrap semantics */
function bootstrapReport() {
    var document = arguments[0];

    return function(el, err) {
        if (el.length) {
            el = el[0];
        }

        var parent = html.findParent(el, function(el) {
            return html.hasClass(el, 'form-group');
        });
        if (!parent) {
            return;
        }

        if (err) {
            html.removeClass(parent, 'has-success');
            html.addClass(parent, 'has-error');
        }
        else {
            html.removeClass(parent, 'has-error');
            html.addClass(parent, 'has-success');
        }

        updateErrorMessage(document, parent, err);
    }
}

exports.lazy = lazyReport;
exports.bootstrap = bootstrapReport;
exports.blackHole = blackHoleReport;
exports.log = logReport;
exports.chain = chainReport;
