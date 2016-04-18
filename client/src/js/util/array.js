'use strict';

Array.prototype.first = function () {
    return this[0];
};

Array.prototype.last = function () {
    return this[this.length - 1];
};

Array.prototype.isEmpty = function () {
    return this.length == 0;
};

Array.prototype.pushAll = function (array) {
    this.push.apply(this, array);
};

Array.prototype.unshiftAll = function (array) {
    this.unshift.apply(this, array.reverse());
};

Array.prototype.remove = function (item) {
    var index = this.indexOf(item);
    return ~index ? this.splice(index, 1) : [];
};

Array.prototype.clear = function () {
    this.length = 0;
};

export function uniqueFilter(value, index, self) {
    return self.indexOf(value) === index;
}

export function concat(values) {
    return Array.prototype.concat.apply([], values);
}

export function syncArrays(arrays) {
    let length = Math.max.apply(null, arrays.map(array => array.length));

    let result = new Array(length);

    let i = length;
    while(i--) {
        result[i] = arrays.map(array => array[i]);
    }

    return result;
}

export function mergeArrayOfObjects(array) {
    return Object.assign.apply(null, [{}].concat(array));
}
