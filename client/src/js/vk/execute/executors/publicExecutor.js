'use strict';

import {protocol} from './../../../params';

import {fetch} from './../../../net';

export function execute({method, params}) {
    return fetch({
        url: `${protocol}://api.vk.com/method/${method.name}`,
        data: params,
        dataType: 'jsonp'
    });
}
