'use strict';

import {successCallback} from './../util';

export function frameHeight(height) {
    VK.callMethod('resizeWindow', null, height)
}

let id = 2000;

function getId() {
    return ++id;
}

export function callMethod(method, params) {
    let id = getId();

    console.rec({id, sdk: {method, params}});

    return new Promise((resolve, reject) => VK.api(method, params, successCallback(id, resolve, reject)));
}
