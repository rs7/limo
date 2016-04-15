'use strict';

import {language, isSecure} from './../params';

export function populate(params, options = {}) {
    let result = Object.assign({}, params);

    result.v = '5.50';

    if (options.lang && language) {
        result.lang = language;
    }

    if (options.https && isSecure) {
        result.https = 1;
    }

    return result;
}

export function stripDefault({method, params: source}) {
    let defaults = method.default;

    if (!defaults) {
        return {method, params: source};
    }

    let params = {};
    Object.keys(source).forEach(key => {
        if (source[key] != defaults[key]) {
            params[key] = source[key];
        }
    });
    return {method, params};
}
