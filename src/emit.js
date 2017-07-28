var defaults = require('lodash/defaults');
var debounce = require('lodash/debounce');
var forEach = require('lodash/foreach');
var validate = require('./validate');
var dom = require('domquery');

// setup dom event listeners on the form
function domListenerEmitter(validator) {
    dom(validator.form).on('submit', function(e) {
        e.preventDefault();

        validator.validate({}, true).then(function(validateResult) {
            validator.emit('form.submit', validateResult, validator);
            if (!validateResult.isValid) {
                return;
            }
            validator.emit('form.valid', validateResult, validator);
        });
    });

    var rollingValidate = debounce(function(el) {
        validator.validate()
            .then(createEmitFormValidate(validator))
            .then(null, console.log);
    }, validator.config.wait, {leading: true, trailing: true});

    function eventListener(event) {
        var el = event.currentTarget;
        validator.cachedValidateResult = null;

        if (!validator.config.rolling) {
            return;
        }

        validator.validate({validationKeys: [el.name]})
            .then(createEmitFormResults(validator))
            .then(null, console.log);

        rollingValidate(el);
    }

    validator.config.eventTypes.forEach(function(type) {
        forEach(validator.form.elements, function(el) {
            dom(el).on(type, eventListener);
        });
    });
}

function createEmitFormResults(validator) {
    return function(validateResult) {
        validateResult.resultCollections.forEach(function(results) {
            console.log('emitting form results', validator);
            try {
                validator.emit('form.results', results, validator);
            } catch (e) {
                console.log(e);
            }
        });
        return validateResult;
    };
}

function createEmitFormValidate(validator) {
    return function(validateResult) {
        validator.cachedValidateResult = validateResult;
        validator.emit('form.validate', validateResult, validator);
        return validateResult;
    };
}

exports.domListenerEmitter = domListenerEmitter;
exports.createEmitFormResults = createEmitFormResults;
exports.createEmitFormValidate = createEmitFormValidate;
