'use strict';

const md5 = require('md5');

import {appId, secretKey} from './config';

export function authCheck(user, authKey) {
    return authKey === md5(`${appId}_${user}_${secretKey}`);
}
