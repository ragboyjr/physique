/** performs a not operation on the result of inner validator */
function not(v) {
    return function(_, cb) {
        return v(_, function(res) {
            cb(!res);
        });
    }
}

function always() {
    return stub(true);
}
function never() {
    return stub(false);
}

function stub(res) {
    return function(_, cb) {
        return cb(res);
    }
}

function identity() {
    return function(val, cb) {
        cb(val);
    }
}

function map(v, predicate) {
    return function(val, cb) {
        v(predicate(val), cb);
    }
}

exports.not = not;
exports.always = always;
exports.never = never;
exports.stub = stub;
exports.identity = identity;
exports.map = map;
