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

export function uniqueFilter(value, index, self) {
    return self.indexOf(value) === index;
}
