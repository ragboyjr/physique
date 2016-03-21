function findParent(el, matches) {
    while (el.parentElement) {
        el = el.parentElement;
        if (matches(el)) {
            return el;
        }
    }
}

function hasClass(node, cls) {
    var classAttr = node.getAttribute('class');
    if (!classAttr) {
        return false;
    }

    return classAttr == cls ||
        classAttr.indexOf(' ' + cls + ' ') !== -1 ||
        classAttr.indexOf(cls + ' ') === 0 ||
        (
            classAttr.indexOf(' ' + cls) !== -1 &&
            classAttr.indexOf(' ' + cls) === classAttr.length - cls.length - 1
        ) /* -1 because of the extra space */
}

function addClass(node, cls) {
    opClassSet(node, function(clsSet) {
        /* class already exists */
        if (clsSet.indexOf(cls) !== -1) {
            return clsSet;
        }

        clsSet.push(cls);
        return clsSet;
    });
}

function removeClass(node, cls) {
    opClassSet(node, function(clsSet) {
        /* class doesn't exists */
        var index = clsSet.indexOf(cls);
        if (index === -1) {
            return clsSet;
        }

        clsSet.splice(index, 1);
        return clsSet;
    });
}

var WsSplitRe = /\s+/;
function opClassSet(node, op) {
    var classAttr = node.getAttribute('class');
    var clsSet;
    if (!classAttr) {
        clsSet = [];
    }
    else {
        clsSet = classAttr.split(WsSplitRe);
    }

    node.setAttribute('class', op(clsSet).join(' '));
}

function enable(node) {
    node.removeAttribute('disabled');
}
function disable(node) {
    node.setAttribute('disabled', 'disabled');
}

exports.findParent = findParent;
exports.hasClass = hasClass;
exports.addClass = addClass;
exports.removeClass = removeClass;
exports.enable = enable;
exports.disable = disable;
