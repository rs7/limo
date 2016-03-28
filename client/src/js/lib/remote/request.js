'use strict';

import {user} from '../params';

import {get, post} from './exec';

export function setSnapshot(snapshot) {
    return post('/snapshot', {user}, {snapshot});
}

export function getFeeds(from) {
    return get('/feed', {user, from});
}