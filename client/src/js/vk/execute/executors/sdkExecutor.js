'use strict';

import {callMethod} from './../../sdk';

import {stripDefault} from './../../options';

export function execute(request) {
    let {method, params} = stripDefault(request);

    return callMethod(method.name, params);
}
