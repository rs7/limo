'use strict';

import {syncArrays, mergeArrayOfObjects} from './../util/array';

import * as model from './model';

import {Cache} from './cache';

const NAME_CASE_FIELDS = ['first_name', 'last_name'];

let cache = new Cache(getUsersWorker);

export function getUsers(users) {
    return cache.get(users);
}

function getUsersWorker(users) {
    return Promise.all([
        getRemoteUsers(users, ['photo_50', 'domain', 'sex'], 'nom'),
        getRemoteUsers(users, [], 'dat')
    ]).then(
        results => syncArrays(results).map(mergeArrayOfObjects)
    );
}

function getRemoteUsers(users, fields, nameCase) {
    return model.getUsers(users, fields, nameCase).then(
        users => users.map(user => processNameCase(user, nameCase))
    );
}

function processNameCase(user, nameCase) {
    let processedUser = Object.assign({}, user);

    NAME_CASE_FIELDS.forEach(field => {
        processedUser[`${field}_${nameCase}`] = user[field];
        delete processedUser[field];
    });

    return processedUser;
}
