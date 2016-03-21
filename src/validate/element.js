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

function validator(v, msg) {
    return {
        validator: v,
        message: msg
    };
}

exports.validateNotEmpty = validateNotEmpty;
exports.notEmpty = validateNotEmpty;

exports.validateLength = validateLength;
exports.length = validateLength;

exports.validateRegExp = validateRegExp;
exports.regExp = validateRegExp;

exports.validateChecked = validateChecked;
exports.checked = validateChecked;

exports.validator = validator;
