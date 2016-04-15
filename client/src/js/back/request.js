'use strict';

import {user} from './../params';

import {get, post} from './executor';

export function setSnapshot(snapshot) {
    return post('/snapshot', {user}, snapshot);
}

export function getFeeds(from) {
    return get('/feed', {user, from});
}

export function getNewFeeds(to) {
    return get('/feed/new', {user, to});
}
