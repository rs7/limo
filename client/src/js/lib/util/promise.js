'use strict';

export function timeout(delay) {
    return new Promise(resolve => setTimeout(resolve, delay));
}

export {Deferred} from './Deferred';
