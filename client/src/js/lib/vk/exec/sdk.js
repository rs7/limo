'use strict';

import {promiseCb} from '../../util';

import {api} from '../../vk_sdk';

export function sdk({method, params}) {
    console.log('sdk', {method, params});

    return new Promise((resolve, reject) =>
        api(method.name, params, promiseCb(resolve, reject))
    );
}
