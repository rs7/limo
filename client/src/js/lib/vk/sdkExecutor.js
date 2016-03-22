'use strict';

import {callMethod} from '../vk_sdk';

export function execute({method, params}) {
    console.log('sdk.execute', {method, params});

    return callMethod(method.name, params);
}
