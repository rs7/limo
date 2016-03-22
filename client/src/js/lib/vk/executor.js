'use strict';

import {populate} from './options';

import {addRequest} from './queue';

export function execute({method, params, options}) {
    let request = {
        method,
        params: populate(params, options)
    };

    return addRequest(request);
}
