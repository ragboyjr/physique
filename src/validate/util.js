var Promise = require('promise/lib/es6-extensions');
var _map = require('lodash.map');

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

function mapMany(v, values, cb, predicate) {
    var promises = _map(values, function(item) {
        return new Promise(function(resolve, reject) {
            v(item, resolve);
        });
    });
    Promise.all(promises).then(function(results) {
        cb(predicate(results))
    });
}

function some(v) {
    return function(val, cb) {
        mapMany(v, val, cb, function(results) {
            return results.some(function(x) {return x});
        });
    }
}

exports.not = not;
exports.always = always;
exports.never = never;
exports.stub = stub;
exports.identity = identity;
exports.map = map;
exports.some = some;
