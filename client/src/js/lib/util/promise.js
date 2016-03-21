'use strict';

export function timeout(delay) {
    return new Promise(resolve => setTimeout(resolve, delay));
}

export function Deferred() {
    this.resolve = null;
    this.reject = null;

    this.promise = new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
    });

    Object.freeze(this);
}
