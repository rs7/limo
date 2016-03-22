'use strict';

import {execute} from '../vk_request';

import {stripDefault} from './options';

import {Deferred} from '../util';

export let groupLimit = 25;

export function canGroup(task) {
    return task.request.method.name != 'execute';
}

function createRequest(requests) {
    let code = `return [${requests.map(stripDefault).map(getApiCall).join()}];`;
    return execute(code);
}

function getApiCall(request) {
    return `API.${request.method.name}(${JSON.stringify(request.params)})`;
}

export function group(tasks) {
    let request = createRequest(tasks.map(task => task.request));
    let deferred = new Deferred();

    tasks.forEach((task, index) => task.deferred.follow(deferred.promise.then(results => results[index])));

    return {request, deferred};
}
