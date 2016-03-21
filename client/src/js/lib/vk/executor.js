'use strict';

import {Deferred} from '../util';

import {populate} from './options';

import {throttle} from './throttle';

//import {compose} from './executeComposer';

import {execute as run} from './sdkExecutor';

export function execute({method, params, options}) {
    let request = {
        method,
        params: populate(params, options)
    };

    return throttle(request, run);
}
