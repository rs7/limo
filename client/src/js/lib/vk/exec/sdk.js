'use strict';

import {api} from '../../vk_sdk';

export function sdk({method, params}) {
    return new Promise((resolve, reject) => {
        api(method.name, params, response => {
            if (response.response) {
                return resolve(response.response);
            }

            reject(response.error || response);
        });
    });
}
