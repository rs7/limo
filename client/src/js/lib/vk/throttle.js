'use strict';

import {timeout} from '../util';

const params = {
    time: 3000,
    count: 9
};

let last = [];

export function throttle(request, executer) {
    let delay = add();

    return timeout(delay).then(() => executer(request));
}

function add() {
    let delay = when();
    remember(delay);
    return delay;
}

function remember(delay) {
    last.push(new Date(new Date().getTime() + delay));
    last = last.slice(-params.count);
}

function when() {
    if (last.length < params.count) {
        return 0;
    }

    let time = params.time - (new Date().getTime() - last.first().getTime());

    return Math.max(0, time);
}
