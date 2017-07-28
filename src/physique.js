var validate = require('./validate');
var emit = require('./emit');
var pkg = require('./package');
var report = require('./report');
var defaults = require('lodash/defaults');
var Promise = require('es6-promise').Promise
var reduce = require('lodash/reduce');
var ee = require('event-emitter');


function make(form, validateForm) {
    return (new WrappedValidator(form, validateForm)).with(pkg.stdPackage());
}

function ValidateFormResult(resultCollections, isValid) {
    this.resultCollections = resultCollections;
    this.isValid = isValid;
}

function WrappedValidator(form, validateForm, config, bootstraps, reporter) {
    this.validateForm = validateForm;
    this.form = form;
    this.bootstraps = bootstraps || [];
    this.report = reporter || report.blackHoleReport();
    this.cachedValidateResult;
    this.configure(config || {});
}

WrappedValidator.prototype.isValid = function() {
    return this.cachedValidateResult && this.cachedValidateResult.isValid;
}

WrappedValidator.prototype.validate = function(ctx, shouldEmit) {
    shouldEmit = shouldEmit || false;

    var res;

    if (this.isValid()) {
        res = Promise.resolve(this.cachedValidateResult);
    } else {
        res = this.validateForm(this.form, ctx).then(function(results) {
            var resultCollections = validate.ValidationResultCollection.accumulateFromResults(results);
            var isValid = resultCollections.every(function(results) {
                return results.isValid();
            });
            return new ValidateFormResult(resultCollections, isValid);
        });
    }

    if (shouldEmit) {
        res = res.then(emit.createEmitFormResults(this))
            .then(emit.createEmitFormValidate(this));
    }

    return res.then(null, console.log);
}

WrappedValidator.prototype.run = function() {
    var self = this;
    this.bootstraps.forEach(function(bs) {
        bs(self);
    });
    return this;
}

WrappedValidator.prototype.with = function(pkg) {
    pkg(this);
    return this;
}

WrappedValidator.prototype.configure = function(config) {
    this.config = defaults(config, {
        rolling: true,
        runValidate: true,
        tillSubmit: false,
        eventTypes: ['input', 'change'],
        wait: 250,
        syncMatches: true,
        disableSubmit: false,
    });
    return this;
}

WrappedValidator.prototype.setReport = function(report) {
    this.report = report;
    return this;
}

ee(WrappedValidator.prototype);

exports.make = make;
exports.Promise = Promise;

// export validate exports into this package
[validate, pkg, report].forEach(function(mod) {
    reduce(mod, function(exports, value, key) {
        exports[key] = value;
        return exports;
    }, exports);
});
