'use strict';

//todo: заменить на promise.catch().then(finally)
Promise.prototype.finally = function (callback) {
    let p = this.constructor;
    return this.then(
        value => p.resolve(callback()).then(() => value),
        reason => p.resolve(callback()).then(() => {
            throw reason
        })
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

export class ProgressStepper {
    constructor(progress, count) {
        this.progress = progress;
        this.total = count;
        this.completed = 0;
    }

    complete(count = 1) {
        this.completed += count;
        this.progress(this.completed / this.total);
    }
}
