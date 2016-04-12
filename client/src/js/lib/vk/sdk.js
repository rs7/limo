'use strict';

import {responseCallback} from './../util';

export function frameHeight(height) {
    VK.callMethod('resizeWindow', null, height)
}

export function callMethod(method, params) {
    return new Promise((resolve, reject) => VK.api(method, params, responseCallback(resolve, reject)));
}
