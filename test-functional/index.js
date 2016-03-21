var physiq = require('physique');
var validateForm = physiq.form.validateFormRolling,
    onSubmit = physiq.form.onSubmit,
    element = physiq.element,
    validator = element.validator,
    report = physiq.report;

var form = document.forms['main'];

var formValidator = validateForm({
    first_name: validator(element.notEmpty(), "Please enter a first name"),
    last_name: validator(element.notEmpty(), "Please enter a last name"),
    email: validator(element.regExp(/.+@.+/), "Invalid email address"),
    check: validator(element.checked(), "You must check the box"),
}, report.bootstrapFormGroup);

formValidator(form, function(res) {
    console.log(res);
});
