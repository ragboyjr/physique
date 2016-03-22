var Promise = require('promise/lib/es6-extensions');
var html = require('../html');
var zip = require('lodash.zip');
var map = require('lodash.map');
var forEach = require('lodash.foreach');
var defaults = require('lodash.defaults');
var isEmpty = require('lodash.isempty');

/** form validation decorator to perform the validation on submit of the form */
function onSubmit(v) {
    return function(form, cb) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            v(form, cb);
            return false;
        });
    }
}

function resolvePromisesToErrors(validators, promises, cb) {
    Promise.all(promises).then(function(results) {
        var res = zip(Object.keys(validators), results).reduce(function(acc, tup) {
            if (!tup[1]) {
                acc[tup[0]] = validators[tup[0]].message;
            }

            return acc;
        }, {});

        cb(isEmpty(res) ? null : res);
    }).catch(function(err) {
        console.log(err);
    });
}

function mapValidatorsToPromises(keys, validators, createPromise) {
    return keys.map(function(key) {
        var v = validators[key];
        return createPromise(key, v);
    });
}

/** form validation that occurs on event triggers instead of on submit. This algorithm accomplishes then
    exact same thing as rolling(validateFormHtml()), except that this implementation is much more
    efficient and doesn't validate the form on every element event trigger */
function validateFormRolling(validators, report) {
    var conf = defaults(arguments[2] || {}, {
        events: ["input", "change"],
        disableSubmit: true,
    });
    var StateInvalid = 0;
    var StateValid = 1;
    var StateNone = 2;

    function createValidationState(form) {
        return Object.keys(validators).reduce(function(acc, k) {
            acc[k] = StateNone;
            return acc;
        }, {});
    }

    function allStatesValid(states) {
        return Object.keys(states).every(function(k) {
            return states[k] == StateValid;
        });
    }

    function resultFromStates(states) {
        var res = Object.keys(states).reduce(function(acc, k) {
            if (states[k] == StateInvalid) {
                acc[k] = validators[k].message;
            }

            return acc;
        }, {});

        return isEmpty(res) ? null : res;
    }

    return function(form, cb) {
        var elStates = createValidationState(form);
        var submitBtn = form.querySelector('[type=submit]');

        if (submitBtn && conf.disableSubmit) {
            html.disable(submitBtn);
        }

        function onValidate(el, k, v, res) {
            report(el, res ? null : v.message);

            var newState = res ? StateValid : StateInvalid;
            if (elStates[k] == newState) {
                return; /* no change was made, no need to do anything */
            }

            elStates[k] = newState;

            if (submitBtn && conf.disableSubmit) {
                var func = allStatesValid(elStates) ? html.enable : html.disable;
                func(submitBtn);
            }

            cb(resultFromStates(elStates));
        }

        /** assign listeners */
        forEach(validators, function(v, k) {
            var el = form.elements[k];
            function onEvent() {
                v.validator(el, function(res) {
                    onValidate(el, k, v, res);
                });
            }
            conf.events.forEach(function(ev) {
                if (!el.nodeName && el.length) {
                    forEach(el, function(el) {
                        el.addEventListener(ev, onEvent);
                    });
                }
                else {
                    el.addEventListener(ev, onEvent);
                }

            });

            /* if the element already has a value, then run the validation */
            if (!el.length && el.value && el.type == "text") {
                onEvent();
            }
        });
    }
}

/** form validation decorator for updating the html with the error message */
function validateFormHtml(validators, report) {
    return function(form, cb) {
        var promises = map(validators, function(v, k) {
            var el = form.elements[k];
            return new Promise(function(resolve, reject) {
                v.validator(el, resolve);
            }).then(function(res) {
                report(el, res ? null : v.message);
                return res;
            });
        });

        resolvePromisesToErrors(validators, promises, cb);
    }
}

/** validates a form object with a map of form element names to validator
    structs */
function validateForm(validators) {
    return function(form, cb) {
        var promises = map(validators, function(v, k) {
            return new Promise(function(resolve, reject) {
                v.validator(form.elements[k], resolve);
            });
        });

        resolvePromisesToErrors(validators, promises, cb);
    }
}

exports.form = validateForm;
exports.formHtml = validateFormHtml;
exports.formRolling = validateFormRolling;
exports.onSubmit = onSubmit;
