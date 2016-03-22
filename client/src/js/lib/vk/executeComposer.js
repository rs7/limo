'use strict';

import {execute} from '../vk_request';

import {stripDefault} from './options';

export function compose(requests) {
    let code = `return [${requests.map(stripDefault).map(getApiCall).join()}];`;
    let request = execute(code);

    return request;
}

function getApiCall(request) {
    return `API.${request.method.name}(${JSON.stringify(request.params)})`;
}
