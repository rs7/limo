'use strict';

import {Deferred} from '../util';

import {execute as run} from './sdkExecutor';
//import {execute as run} from './oauthExecutor';

import {throttle} from './throttle';

import {timeout} from '../util';

import {compose} from './executeComposer';

export function addRequest(request) {
    let deferred = new Deferred();

    let task = {
        request,
        deferred
    };

    if (request.method.name == 'execute') {
        schedule(task)
    } else {
        addToBucket(task)
    }

    return deferred.promise;
}

function schedule(task) {
    let delay = throttle.next();

    console.log('schedule', delay, task);

    setTimeout(() => {
        task.deferred.follow(run(task.request));
    }, delay);
}

function addToBucket(task) {
    bucket.push(task);

    clearTimeout(bucketFlushTimer);

    if (bucket.length == 25) {
        flushBucket();
        return;
    }

    bucketFlushTimer = setTimeout(flushBucket, 100);
}

function flushBucket() {
    console.log('flushBucket', bucket.length);

    let task;

    if (bucket.length == 1) {

        task = bucket.first();

    } else {

        let request = compose(bucket.map(task => task.request));
        let deferred = new Deferred();
        bucket.forEach((task, index) => task.deferred.follow(deferred.promise.then(results => results[index])));

        task = {request, deferred};

    }

    schedule(task);

    bucket.length = 0;
}

let bucket = [];
let bucketFlushTimer;
