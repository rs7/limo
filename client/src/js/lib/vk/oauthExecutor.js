'use strict';

import {accessToken} from '../params';

import {fetch} from '../util';

const PARAMS = {
    access_token: accessToken
};

export function execute({method, params}) {
    return fetch({
        url: `https://api.vk.com/method/${method.name}`,
        data: Object.assign({}, params, PARAMS),
        dataType: 'jsonp'
    });
}
