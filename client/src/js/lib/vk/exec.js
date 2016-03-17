'use strict';

import {accessToken, language, isSecure, protocol} from '../params';

import {ajax} from '../util';

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

function createParams(params, options, constOptions) {
    let query = Object.assign({}, params);
    let opts = Object.assign({}, constOptions, options);

    Object.keys(opts).filter(key => opts[key] && CONST_PARAMS[key]).forEach(key => {
        query[key] = CONST_PARAMS[key];
    });

    return query;
}

export function pub({method, params, options}) {
    let query = createParams(params, options, CONST_PUBLIC_OPTIONS);

    return ajax({
        url: `${protocol}://api.vk.com/method/${method}`,
        data: query,
        dataType: 'jsonp'
    });
}

export function priv({method, params, options}) {
    let query = createParams(params, options, CONST_PRIVATE_OPTIONS);

    return ajax({
        url: `https://api.vk.com/method/${method}`,
        data: query,
        dataType: 'jsonp'
    });
}
