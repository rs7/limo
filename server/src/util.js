'use strict';

let md5 = require('md5');

import {appId, secretKey} from './config';

export function authCheck(user, authKey) {
    return authKey === md5(`${appId}_${user}_${secretKey}`);
}

export function sliceObject(object, keys) {
    let slice = {};
    keys.forEach(key => slice[key] = object[key]);
    return slice;
}
