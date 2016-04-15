'use strict';

import {user, authKey} from './../params';

import {fetch} from './../net';
import {jsonResultHandler, xhrErrorHandler, createURIQuery} from './../util/net';

const CONST_SERVER_PARAMS = {
    auth: authKey,
    user: user
};

export function get(endpoint, params) {
    let query = Object.assign({}, params, CONST_SERVER_PARAMS);

    return fetch({
        url: endpoint,
        data: query
    }).then(jsonResultHandler).catch(xhrErrorHandler);
}

export function post(endpoint, params, data) {
    let url = endpoint;

    let query = Object.assign({}, params, CONST_SERVER_PARAMS);
    let queryURI = createURIQuery(query);

    if (queryURI) {
        url += `?${queryURI}`;
    }

    return fetch({
        url: url,
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json'
    }).then(jsonResultHandler).catch(xhrErrorHandler);
}
