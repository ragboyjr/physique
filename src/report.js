/* Reports are what do any of the validation reporting and UI updating. */
var html = require('./html');

/** updates an elements parent 'form-group' */
function bootstrapFormGroup(el, err) {
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
}

exports.bootstrapFormGroup = bootstrapFormGroup;
