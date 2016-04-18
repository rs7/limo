'use strict';

import {callMethod} from './../../sdk';

import {stripDefault} from './../../options';

import {Counter} from './../../../util/util';

let requestId = new Counter(2000);

export function execute(request) {
    let {method, params} = stripDefault(request);

    let id = requestId.getNext();

    console.rec({id, request: params});

    return callMethod(method.name, params).transparent(response => console.rec({id, response}));
}
