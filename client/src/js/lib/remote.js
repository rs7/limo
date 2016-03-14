'use strict';

const $ = require('jquery');

import {user, authKey, protocol, accessToken, language, isSecure} from './params';

const CONST_SERVER_PARAMS = {
    auth: authKey,
    user: user
};

export class Remote {
    static get(endpoint, params) {
        let query = Object.assign({}, params, CONST_SERVER_PARAMS);

        return ajax({
            url: endpoint,
            data: query
        });
    }

    static post(endpoint, data) {
        let query = Object.assign({}, data, CONST_SERVER_PARAMS);

        return ajax({
            url: endpoint,
            type: 'POST',
            data: JSON.stringify(query),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json'
        });
    }
}

const CONST_PARAMS = {
    v: 5.50,
    access_token: accessToken,
    lang: language == 0 ? undefined : language,
    https: isSecure ? 1 : undefined
};

const CONST_PUBLIC_OPTIONS = {
    v: 1
};

const CONST_PRIVATE_OPTIONS = {
    v: 1,
    access_token: 1
};

function createQuery(params, options, constOptions = {}) {
    let query = Object.assign({}, params);
    let opts = Object.assign({}, constOptions, options);

    Object.keys(opts).filter(key => opts[key] && CONST_PARAMS[key]).forEach(key => {
        query[key] = CONST_PARAMS[key];
    });

    return query;
}

export class VK {
    static public(method, params, options = {}) {
        let query = createQuery(params, options, CONST_PUBLIC_OPTIONS);

        return ajax({
            url: `${protocol}://api.vk.com/method/${method}`,
            data: query,
            dataType: 'jsonp'
        });
    }

    static private(method, params, options = {}) {
        let query = createQuery(params, options, CONST_PRIVATE_OPTIONS);

        return ajax({
            url: `https://api.vk.com/method/${method}`,
            data: query,
            dataType: 'jsonp'
        });
    }
}

function ajax(params) {
    return new Promise((resolve, reject) => {
        $.ajax(params).then(
            response => {
                if (response.response) {
                    return resolve(response.response);
                }

                reject(response.error || response);
            },
            reject
        );
    });
}
