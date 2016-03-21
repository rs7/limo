'use strict';

const $ = require('jquery');

import {user, authKey} from '../params';

import {fetch} from '../util';

const CONST_SERVER_PARAMS = {
    auth: authKey,
    user: user
};

export function get(endpoint, params) {
    let query = Object.assign({}, params, CONST_SERVER_PARAMS);

    return fetch({
        url: endpoint,
        data: query
    });
}

export function post(endpoint, params, data) {
    let url = endpoint;

    let query = Object.assign({}, params, CONST_SERVER_PARAMS);

    let queryStr = $.param(query);

    if (queryStr) {
        url += `?${queryStr}`;
    }

    return fetch({
        url: url,
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json'
    });
}
