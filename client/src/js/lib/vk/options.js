'use strict';

import {language, isSecure} from '../params';

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
