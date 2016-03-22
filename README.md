# Physique (Form) Validation

Functional style front-end form validation designed with CommonJS.

## Usage

```js
var physique = require('physique');
var v = physique.validation;
var validator = v.validator;

var form = document.forms['form_name'];

var formReport = physique.report.bootstrap(document);
var formValidator = v.formHtml({
    name: validator(v.notEmpty(), "Name cannot be empty"),
    password: validator(v.length(v.gt(6)), "Must be longer than 6 characters"),
    confirm_password: validator(v.matches(form, "password"), "Does not equal password"),
    phone: validator(v.regExp(/\d{3}-\d{3}-\d{4}/), "Invalid phone number. xxx-xxx-xxxx"),
    radio_group: validator(v.some(v.checked()), "You must select one of the options"),
    checkbox: validator(v.checked(), "You must check the checkbox"),
    opt_out_checkbox: validator(v.not(v.checked()), "You must opt out of this checkbox"),
}, formReport);
formValidator = v.onSubmit(formValidator);

formValidator(form, function(res) {
    if (res != null) {
        /* res is an object of errors */
        return;
    }

    /* res == null meaning form is valid */
})
```

## Validators

tbd

### Form Validators

tbd

### Element Validators

tbd

### Util Validators

tbd

### Comparators

tbd

## Reporters

tbd
