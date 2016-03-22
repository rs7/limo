'use strict';

import {protocol} from '../params';

import {ajax} from '../util';

export function execute({method, params}) {
    return ajax({
        url: `${protocol}://api.vk.com/method/${method.name}`,
        data: params,
        dataType: 'jsonp'
    });
}
