'use strict';

export function timeout(delay) {
    return new Promise(resolve => setTimeout(resolve, delay));
}

export {Deferred} from './Deferred';

Promise.prototype.finally = function (callback) {
    let p = this.constructor;
    return this.then(
        value => p.resolve(callback()).then(() => value),
        reason => p.resolve(callback()).then(() => {
            throw reason
        })
    );
};
