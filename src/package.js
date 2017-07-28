var emit = require('./emit');
var report = require('./report');
var defaults = require('lodash/defaults');
var dom = require('domquery');

function stdPackage() {
    return function(validator) {
        validator.bootstraps.push(function(validator) {
            emit.domListenerEmitter(validator);
        });
        validator.with(matchesSyncPackage());
        validator.with(disableSubmitPackage());
        validator.with(reportPackage());
    }
}

/** disables and enables the submit button off of the form.validate event */
function disableSubmitPackage() {
    return function(validator) {
        var submitBtn = validator.form.querySelector('[type=submit]');

        function onFormValidateListener(validateResult) {
            if (validateResult.isValid) {
                submitBtn.removeAttribute('disabled');
            } else {
                submitBtn.setAttribute('disabled', 'disabled');
            }
        }

        validator.bootstraps.push(function(validator) {
            if (!validator.config.disableSubmit) {
                return;
            }

            if (validator.config.runValidate) {
                validator.validate({}, false).then(emit.createEmitFormValidate(validator));
            }

            validator.on('form.validate', onFormValidateListener);
        });
    }
}

function reportPackage() {
    return function(validator) {
        validator.bootstraps.unshift(function(validator) {
            if (!validator.report) {
                return;
            }

            var reportEl = report.lazyReport(validator.report);
            var hasSubmit = false;

            function reportResultCol(resultCol) {
                if (!resultCol.element) {
                    return;
                }
                reportEl(resultCol.element, resultCol.isValid());
            }

            validator.on('form.results', function(resultCol, validator) {
                if (validator.config.tillSubmit && !hasSubmit) {
                    return;
                }
                reportResultCol(resultCol);
            });
            validator.on('form.submit', function(validateResult, validator) {
                hasSubmit = true;
                validateResult.resultCollections.forEach(reportResultCol);
            });
        });
    }
}

/** ensures that a matches element stays synced */
function matchesSyncPackage() {
    return function (validator) {
        var isSyncingMap = {};

        function onResultsListener(resultCol) {
            if (isSyncingMap[resultCol.element.name]) {
                return;
            }

            var result = resultCol.results.find(function(res) {
                return res.code == 'matches' && !res.isValid;
            });

            if (!result) {
                return;
            }

            var form = result.elements[0].form;
            var matchesElName = result.elements[0].name;
            var matchedEl = form.elements[result.params.otherName];
            isSyncingMap[resultCol.element.name] = true;

            function matchListener(e) {
                validator.validate({
                    validationKeys: [matchesElName]
                })
                .then(emit.createEmitFormResults(validator))
                .then(null, console.log);
            }

            dom(matchedEl).on('input', matchListener);
            validator.config.eventTypes.forEach(function(type) {
                dom(matchedEl).on(type, matchListener);
            });
        }

        validator.bootstraps.push(function(validator) {
            if (!validator.config.syncMatches) {
                return;
            }

            validator.on('form.results', onResultsListener);
        });
    }
}

exports.stdPackage = stdPackage;
exports.disableSubmitPackage = disableSubmitPackage;
exports.reportPackage = reportPackage;
exports.matchesSyncPackage = matchesSyncPackage;
