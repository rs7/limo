'use strict';

import {callMethod} from './../../../vk_sdk';

import {stripDefault} from './../../options';

export function execute(request) {
    let {method, params} = stripDefault(request);

    console.log('>>', method.name, Object.keys(params).map(key => `${key}=${params[key]}`).join());

    return callMethod(method.name, params);
}
