'use strict';

import {jsonResultHandler} from './../util/net';

export function frameHeight(height) {
    VK.callMethod('resizeWindow', null, height)
}

export function callMethod(method, params) {
    return new Promise(
        (resolve, reject) => VK.api(method, params, resolve)
    ).then(jsonResultHandler);
}
