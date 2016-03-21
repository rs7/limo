'use strict';

const async = require('async-q');

export function auto(tasks, {returnTask, log} = {}) {
    if (log) {
        Object.keys(tasks).forEach(task => tasks[`__AUTO_LOG_${task}`] = [task, results => console.log(`AUTO_LOG ${task} => `, results[task])]);
    }

    return new Promise((resolve, reject) => {
        async.auto(tasks).then(results => resolve(results[returnTask]), reject);
    });
}
