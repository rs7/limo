'use strict';

import {responseCallback} from './util';

function resize(width, height) {
    return VK.callMethod('resizeWindow', width, height);
}

export function frameHeight(height) {
    resize(null, height);
}

export function callMethod(method, params) {
    return new Promise((resolve, reject) => VK.api(method, params, responseCallback(resolve, reject)));
}
