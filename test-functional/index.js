var physique = require('physique');
var Promise = require('es6-promise').Promise;
var dom = require('domquery');
var form = document.forms['main'];
var emit = require('emit');

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
                }, 2000);
            });
        }
    ]),
    state: physique.notEmpty(),
    check: physique.checked(),
    radio: physique.some(physique.checked()),
    password: physique.minLength(4),
    confirmPassword: physique.matches('password')
}))
.configure({
    disableSubmit: false,
    tillSubmit: true
})
.setReport(physique.bootstrapReport())
.on('form.results', function(resultCollection) {
    if (resultCollection.element.name == "confirmPassword") {
        console.log(resultCollection);
    }
})
.on('form.validate', function(validateResult) {
    console.log('logging validate');
    console.log(validateResult.isValid);
})
.on('form.valid', function(validateResult, validator) {
    console.log("I'm submitting the form!");
    setTimeout(function() {
        validator.form.submit();
    }, 2000);
})
.on('form.results', function() {
    console.log('test');
})
.run();


// var formValidator = v.formRolling({
//     first_name: validator(v.notEmpty(), "Please enter a first name"),
//     last_name: validator(v.notEmpty(), "Please enter a last name"),
//     email: validator(v.regExp(/.+@.+/), "Invalid email address"),
//     state: validator(v.notEmpty(), "Please choose a state"),
//     check: validator(v.checked(), "You must check the box"),
//     radio: validator(v.some(v.checked()), "You must select one of the options"),
// }, report.lazy(report.chain([report.log(), report.bootstrap(document)])));
//
// formValidator(form, function(res) {
//     console.log(res);
// });
