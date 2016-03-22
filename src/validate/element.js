var cmp = require('./cmp');

function validateNotEmpty() {
    return validateLength(cmp.gt(0));
}

function validateLength(cmp) {
    return function(el, cb) {
        return cb(cmp(el.value.length));
    }
}

function validateRegExp(re) {
    return function(el, cb) {
        return cb(re.test(el.value));
    }
}

function validateChecked() {
    return function(el, cb) {
        return cb(el.checked);
    }
}

/** compares one element value to another */
function validateMatches(form, otherName) {
    return function(el, cb) {
        return cb(el.value == form.elements[otherName].value);
    }
}

function validator(v, msg) {
    return {
        validator: v,
        message: msg
    };
}

exports.notEmpty = validateNotEmpty;
exports.length = validateLength;
exports.regExp = validateRegExp;
exports.checked = validateChecked;
exports.matches = validateMatches;

exports.validator = validator;
