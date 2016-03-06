'use strict';

import $ from 'jquery';

import {user, authKey, protocol} from './params';

const authParams = {
    auth_key: authKey,
    user_id: user
};

export class Remote {
    static get(endpoint, params) {
        let query = Object.assign({}, params, authParams);

        return ajax({
            url: endpoint,
            data: query
        });
    }

    static post(endpoint, data) {
        let query = Object.assign({}, data, authParams);

        return ajax({
            url: endpoint,
            type: 'POST',
            data: JSON.stringify(query),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json'
        });
    }
}

export class VK {
    static public(method, params, apiVersion = 5.45) {
        let query = Object.assign({}, params, {v: apiVersion});

        return ajax({
            url: `${protocol}://api.vk.com/method/${method}`,
            data: query,
            dataType: 'jsonp'
        });
    }
}

function ajax(params) {
    console.log('ajax', params);

    let promise = new Promise((resolve, reject) => {
        $.ajax(params).then(
            response => {
                if (response.response) {
                    return resolve(response.response);
                }

                reject(response.error || response);
            },
            error => reject(error)
        );
    });

    return promise;
}
