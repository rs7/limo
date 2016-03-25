'use strict';

import {accessToken} from './../../../params';

import {fetch} from './../../../util';

import {stripDefault} from '././../../options';

const PARAMS = {
    access_token: accessToken
};

export function execute(request) {
    let {method, params} = stripDefault(request);

    return fetch({
        url: `https://api.vk.com/method/${method.name}`,
        data: Object.assign({}, params, PARAMS),
        dataType: 'jsonp'
    });
}
