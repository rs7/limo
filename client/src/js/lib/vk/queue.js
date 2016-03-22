'use strict';

import {Deferred} from '../util';

import {execute} from './sdkExecutor';

import {throttle} from './throttle';

import {group, canGroup, groupLimit} from './group';

export function addRequest(request) {
    let task = {
        request,
        deferred: new Deferred()
    };

    add(task);

    return task.deferred.promise;
}

//----------------------------------------

let queue = [];

const bufferDelay = 100;
let bufferTimer;

let bucket = -1;
function bucketBlocked() {
    return !!bufferTimer;
}

function add(task) {
    if (!canGroup(task)) {
        queue.push([task]);
        start();
        return;
    }

    if (bucket == -1) {
        bucket = queue.push([]) - 1;
    }

    if (bufferTimer) {
        clearTimeout(bufferTimer);
        bufferTimer = null;
    }

    queue[bucket].push(task);

    if (queue[bucket].length == groupLimit) {
        bucket = -1;
        start();
        return;
    }

    bufferTimer = setTimeout(() => {
        bufferTimer = null;
        start();
    }, bufferDelay);
}

let nextTimer;

function start() {
    if (nextTimer) {
        return;
    }

    next();
}

function next() {
    if (nextTimer) {
        return;
    }

    if (!send()) {
        return;
    }

    nextTimer = setTimeout(() => {
        nextTimer = null;
        next();
    }, throttle.when());
}

function send() {
    let count = 0;

    queue.slice(0, throttle.vacancy()).forEach((tasks, index) => {
        if (index == bucket) {
            if (bucketBlocked()) {
                return;
            }

            bucket = -1;
        }

        count += tasks.length;
        queue.remove(tasks);
        processTasks(tasks);
    });

    return count;
}

//----------------------------------------

function run(task) {
    task.deferred.follow(execute(task.request));
}

function schedule(task) {
    setTimeout(run, throttle.next(), task);
}

function processTasks(tasks) {
    let task = tasks.length == 1 ? tasks.first() : group(tasks);
    schedule(task);
}

//----------------------------------------
