'use strict';

import {populate} from '../options';

import {pub} from './pub';
import {priv} from './priv';

export function exec({method, params, options}) {
    let request = {
        method,
        params: populate(params, options)
    };

    if (method.public) {
        return pub(request);
    }

    return priv(request);
}
