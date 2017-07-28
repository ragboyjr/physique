var Promise = require('es6-promise').Promise;
var isObject = require('lodash/isObject');
var isArray = require('lodash/isarray');
var isFunc = require('lodash/isfunction');
var assign = require('lodash/assign');
var keys = require('lodash/keys');
var map = require('lodash/map');
var clone = require('lodash/clone');
var flatten = require('lodash/flatten');
var values = require('lodash/values');

function ValidationResultCollection(element, results) {
    this.element = element;
    this.results = results;
}

ValidationResultCollection.prototype.isValid = function() {
    return this.results.every(function(res) {
        return res.isValid;
    });
}

ValidationResultCollection.prototype.errors = function() {
    return this.results.filter(function(res) {
        return !res.isValid;
    });
}

ValidationResultCollection.prototype.isEmpty = function() {
    return this.results.length == 0;
}

ValidationResultCollection.accumulateFromResults = function(results) {
    var formResults = new ValidationResultCollection(null, []);
    var elResults = results.reduce(function(acc, result) {
        // skip these
        if (result.elements.length == 0) {
            formResults.results.push(result);
            return acc;
        }

        result.elements.forEach(function(el) {
            if (acc[el.name] == undefined) {
                acc[el.name] = new ValidationResultCollection(el, [result]);
            } else {
                acc[el.name].results.push(result);
            }
        });

        return acc;
    }, {});

    if (formResults.isEmpty()) {
        return values(elResults);
    }

    return values(elResults).concat([formResults]);
};

function ValidationResult(isValid, code, params, elements) {
    this.isValid = isValid;
    this.code = code;
    this.params = params || {};
    this.elements = elements;
}

ValidationResult.prototype.withElements = function(elements) {
    return new ValidationResult(
        this.isValid,
        this.code,
        clone(this.params),
        elements
    );
}

ValidationResult.prototype.withCode = function(code) {
    return new ValidationResult(
        this.isValid,
        code,
        clone(this.params),
        clone(this.elements)
    );
}

ValidationResult.prototype.withParams = function(params) {
    return new ValidationResult(
        this.isValid,
        this.code,
        params,
        clone(this.elements)
    );
}

ValidationResult.prototype.clone = function() {
    return new ValidationResult(
        this.isValid,
        this.code,
        clone(params),
        clone(this.elements)
    );
}

function chain(validators) {
    return function(value, ctx) {
        var results = validators.map(function(v) {
            return v(value, ctx);
        }, null);

        return Promise.all(results)
            .then(function(results) {
                return results.reduce(function(acc, result) {
                    if (isArray(result)) {
                        return acc.concat(result);
                    }
                    acc.push(result);
                    return acc;
                }, []);
            });
    }
}

/** similar to chain, but stops at first error */
function pipe(validators) {
    return function(value, ctx) {
        return validators.reduce(function(acc, v) {
            if (!acc) {
                return v(value, ctx);
            }

            return acc.then(function(result) {
                if (result.isValid) {
                    return v(value, ctx);
                }

                return result;
            });
        }, null);
    }
}

function form(validators) {
    return function(form, ctx) {
        ctx = ctx || {};

        var validationKeys = ctx.validationKeys || keys(validators);
        var results = validationKeys.map(function(key) {
            var el = form.elements[key];
            if (!el) {
                throw "Form element " + key + " does not exist in form. Check form validator.";
            }
            return validators[key](el, ctx).then(function(results) {
                if (!isArray(results)) {
                    results = [results];
                }

                return results.map(function(res) {
                    if (res.elements.length) {
                        return res;
                    }

                    return res.withElements([el]);
                });
            });
        });

        return Promise.all(results).then(function(results) {
            return flatten(results);
        });
    }
}

function matches(otherName) {
    return function(el) {
        var form = el.form;
        var otherEl = form.elements[otherName];
        if (el.value == otherEl.value) {
            return ok('matches');
        }

        return error('matches', {otherName: otherName});
    }
}

function some(validator) {
    return function(els) {
        return Promise.all(map(els, validator))
            .then(function(results) {
                var validResult = results.find(function(r) { return r.isValid; });
                if (validResult) {
                    return validResult.withElements(map(els));
                }

                return results[0].withElements(map(els));
            });
    }
}

function checked() {
    return function(el) {
        if (el.checked) {
            return ok('checked');
        }

        return error('checked');
    }
}

function minLength(min) {
    return function(el) {
        if (el.value.length >= min) {
            return ok('minLength');
        }

        return error('minLength', {min: min});
    };
}

function maxLength(max) {
    return function(el) {
        if (el.value.length <= min) {
            return ok('maxLength');
        }

        return error('maxLength', {max: max});
    };
}

function regex(re) {
    return function(el) {
        if (re.test(el.value)) {
            return ok('regex');
        }

        return error('regex', {re: re});
    }
}

function notEmpty() {
    return function(el) {
        return el.value.length
            ? ok('notEmpty')
            : error('notEmpty');
    }
}

function ok(code) {
    return Promise.resolve(new ValidationResult(true, code, null, []));
}

function error(code, params) {
    return Promise.resolve(new ValidationResult(false, code, params, []));
}

exports.ValidationResultCollection = ValidationResultCollection;
exports.ValidationResult = ValidationResult;

exports.chain = chain;
exports.pipe = pipe;
exports.form = form;
exports.matches = matches;
exports.some = some;
exports.checked = checked;
exports.minLength = minLength;
exports.maxLength = maxLength;
exports.regex = regex;
exports.notEmpty = notEmpty;
exports.ok = ok;
exports.error = error;
