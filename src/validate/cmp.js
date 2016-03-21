/** less than comparator */
function lt(b) {
    return function(a) {
        return a < b;
    }
}

/** greater than comparator */
function gt(b) {
    return function(a) {
        return a > b;
    }
}

/** less than or equal comparator */
function lte(b) {
    return function(a) {
        return a <= b;
    }
}

/** greater than or equal comparator */
function gte(b) {
    return function(a) {
        return a >= b;
    }
}

/** equal comparator */
function eq(b) {
    return function(a) {
        return a == b;
    }
}

exports.lt = lt;
exports.gt = gt;
exports.lte = lte;
exports.gte = gte;
exports.eq = eq;
