'use strict';

import {accessToken} from '../../params';

import {ajax} from '../../util';

const PARAMS = {
    access_token: accessToken
};

export function priv({method, params}) {
    console.log('priv', {method, params});

    return ajax({
        url: `https://api.vk.com/method/${method.name}`,
        data: Object.assign({}, params, PARAMS),
        dataType: 'jsonp'
    });
}
