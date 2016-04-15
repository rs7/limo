'use strict';

const $ = require('jquery');

import {xhrProgressFactory} from './util/net';

export function fetch(params, progress = Function()) {

    Object.assign(params, {
        xhr: () => xhrProgressFactory(progress)
    });

    return new Promise((resolve, reject) => {
        $.ajax(params).then(resolve, reject);
    });
}
