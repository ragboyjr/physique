var physiq = require('physique');
var v = physiq.validate,
    validator = v.validator,
    report = physiq.report;

var form = document.forms['main'];

var formValidator = v.formRolling({
    first_name: validator(v.notEmpty(), "Please enter a first name"),
    last_name: validator(v.notEmpty(), "Please enter a last name"),
    email: validator(v.regExp(/.+@.+/), "Invalid email address"),
    state: validator(v.notEmpty(), "Please choose a state"),
    check: validator(v.checked(), "You must check the box"),
    radio: validator(v.some(v.checked()), "You must select one of the options"),
}, report.lazy(report.chain([report.log(), report.bootstrap(document)])));

//var formValidator = v.onSubmit(formValidator);

formValidator(form, function(res) {
    console.log(res);
});
