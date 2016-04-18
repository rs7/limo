'use strict';

const $ = require('jquery');

import {xhrProgressFactory} from './util/net';
import {Counter} from './util/util';

let requestId = new Counter(1000);

export function fetch(params, progress = Function()) {

    let id = requestId.getNext();

    console.rec({id, request: params});

    Object.assign(params, {
        xhr: () => xhrProgressFactory(progress)
    });

    return new Promise((resolve, reject) => {
        $.ajax(params).then(resolve, reject);
    }).transparent(response => console.rec({id, response}));
}
