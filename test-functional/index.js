var physique = require('physique');
var Promise = require('es6-promise').Promise;
var dom = require('domquery');
var form = document.forms['main'];
var emit = require('emit');

function emporiumPackage() {
    return function(validator) {
        validator.configure({
            // postValidateEventTypes: ['input']
        })
        .setReport(physique.bootstrapReport({showSuccess: true}))
        .on('form.valid', function(validateResult, validator) {
            validator.form.submit();
        });
    }
}

var validator = physique.make(form, physique.form({
    firstName: physique.notEmpty(),
    lastName: physique.notEmpty(),
    email: physique.pipe([
        physique.regex(/.+@.+/),
        function(el) {
            return new physique.Promise(function(resolve, reject) {
                setTimeout(function() {
                    if (el.value == 'rgarcia@bighead.net') {
                        resolve(physique.error('invalid_email'));
                    } else {
                        resolve(physique.ok('invalid_email'));
                    }
                }, 250);
            });
        }
    ]),
    state: physique.notEmpty(),
    check: physique.checked(),
    radio: physique.some(physique.checked()),
    password: physique.minLength(4),
    confirmPassword: physique.matches('password')
}))
.with(emporiumPackage())
.run();
