var cmp = require('./validate/cmp');
var element = require('./validate/element');
var form = require('./validate/form');
var util = require('./validate/util');

module.exports = [cmp, element, form, util].reduce(function(acc, module) {
    Object.keys(module).forEach(function(k) {
        acc[k] = module[k];
    });
    return acc;
}, {});
