'use strict';

const async = require('async-q');

export function auto(tasks, {returnTask = 'result', log} = {}) {
    if (log) {
        Object.keys(tasks).forEach(task => tasks[`__LOG_${task}`] = [task, results => console.log(`αὐτο_${log} {${task}} => `, results[task])]);
    }

    return new Promise((resolve, reject) => {
        async.auto(tasks).then(results => resolve(results[returnTask]), reject);
    });
}

export let map = async.map;
