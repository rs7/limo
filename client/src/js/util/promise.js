'use strict';

Promise.prototype.finally = function (callback) {
    let p = this.constructor;
    return this.then(
        value => p.resolve(callback()).then(() => value),
        reason => p.resolve(callback()).then(() => {
            throw reason
        })
    );
};

Promise.prototype.log = function (label) {
    return this.then(
        value => this.constructor.resolve(log(label, value)).then(() => value)
    );

    function log(label, value) {
        console.log(label, value);
    }
};

Promise.prototype.transparent = function (callback) {
    return this.then(
        value => this.constructor.resolve(callback(value)).then(() => value)
    );
};

export class Deferred {
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
}
