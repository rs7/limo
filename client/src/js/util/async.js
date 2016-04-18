'use strict';

const async = require('async-q');

import {isFunction} from './util';

export function auto(tasks, {returnTask = 'result', log} = {}) {
    if (log) {
        if (!Array.isArray(log)) {
            log = [log];
        }

        Object.keys(tasks).forEach(task => {
            log.forEach((log, index) => {
                let logger = isFunction(log)? log : defaultLog.bind(null, log);
                tasks[`__LOG_${index}_${task}`] = [task, results => logger(task, results[task])];
            });
        });
    }

    return new Promise((resolve, reject) => {
        async.auto(tasks).then(results => resolve(results[returnTask]), reject);
    });

    function defaultLog(log, task, result) {
        console.log(`αὐτο_${log} {${task}} => `, result);
    }
}
