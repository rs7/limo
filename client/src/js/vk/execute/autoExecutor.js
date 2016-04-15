'use strict';

import * as executors from './executors';
import * as grouping from './group';

//----------------------------------------

import {Deferred} from './../../util/promise';

export function execute({method, params, options}) {
    let deferred = new Deferred();

    let task = {
        method,
        params,
        options,
        deferred
    };

    addTask(task);

    return deferred.promise;
}

function success(task, result) {
    task.deferred.resolve(result);
}

const maxRepeatCount = 3;

function fail(task, error) {
    if (!task.errors) {
        task.errors = [];
    }

    task.errors.push(error);

    if (!task.repeatCount) {
        task.repeatCount = 0;
    }

    task.repeatCount++;

    if (error == 'executeError' && task.repeatCount == maxRepeatCount - 1) {
        task.forceUngroup = true;
    }

    if (task.repeatCount == maxRepeatCount) {
        task.deferred.reject(task.errors.last());
        return;
    }

    addTask(task);
}

//----------------------------------------

let queue = [];

export function addTask(task) {
    if (groupable(task)) {
        addToBuffer(task);
    } else {
        addAlone(task);
    }
}

function addAlone(task) {
    queue.push({
        tasks: [task]
    });
    /**/send();
}

//----------------------------------------

let bufferIndex = -1;
let bufferTimer = 0;
const bufferDelay = 100;

function addToBuffer(task) {
    clearTimeout(bufferTimer);

    if (bufferIndex == -1) {
        bufferIndex = queue.push({
            tasks: [],
            suspended: true
        }) - 1;
    }

    queue[bufferIndex].tasks.push(task);

    if (queue[bufferIndex].tasks.length == grouping.limit) {
        queue[bufferIndex].suspended = false;
        bufferIndex = -1;
        /**/send();
        return;
    }

    queue[bufferIndex].suspended = true;

    bufferTimer = setTimeout(() => {
        queue[bufferIndex].suspended = false;
        /**/send();
    }, bufferDelay);
}

//----------------------------------------

function send() {
    let max = Math.min(idle.length, queue.length);

    for (let index = 0; index < max; index++) {
        if (queue[index].suspended) {
            continue;
        }

        extract(index);
    }
}

function extract(index) {
    let [next] = idle.splice(index, 1);

    let [item] = queue.splice(index, 1);

    if (index == bufferIndex) {
        bufferIndex = -1;
    } else if (index < bufferIndex) {
        bufferIndex--;
    }

    run(item, next);
}

//----------------------------------------

import {populate} from './../options';

function run(item, next) {
    if (item.tasks.length == 1) {
        runAlone(item, next);
    } else {
        runGroup(item, next);
    }
}

function runGroup(item, next) {
    let tasks = item.tasks;
    let requests = item.tasks.map(populateRequest);

    let request = grouping.createRequest(requests);
    let promise = executors.sdk(request);

    promise.then(results => results.forEach((result, index) => {
        let task = tasks[index];

        if (result === false) {
            fail(task, 'executeError');
            return;
        }

        success(task, result);
    }), error => tasks.forEach(task => fail(task, error)));

    next(promise);
}

function runAlone(item, next) {
    let task = item.tasks[0];
    let request = populateRequest(task);
    let promise = executors.sdk(request);

    promise.then(result => success(task, result), error => fail(task, error));

    next(promise);
}

function populateRequest({method, params, options}) {
    return {
        method,
        params: populate(params, options)
    };
}

//----------------------------------------

let idle = [];

function tick(next) {
    idle.push(next);
    /**/send();
}

const time = 3000;
const count = 9;

let workers = [];

class Worker {
    constructor(func, delay) {
        this.func = func;
        this.delay = delay;
        this.tick();
    }

    tick() {
        this.func((promise) => {
            let sch = schedule.bind(this);
            promise.then(sch, sch);
        });

        function schedule() {
            setTimeout(() => this.tick(), this.delay);
        }
    }
}

for (let i = 0; i < count; i++) {
    workers.push(new Worker(tick, time));
}

//----------------------------------------

function groupable(task) {
    return !task.forceUngroup && task.method.name != 'execute';
}
