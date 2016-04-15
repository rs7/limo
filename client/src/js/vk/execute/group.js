'use strict';

import {execute} from './../request';
import {stripDefault} from './../options';

export let limit = 25;

export function createRequest(requests) {
    let code = `return [${requests.map(stripDefault).map(getApiCall).join()}];`;
    return execute(code);
}

function getApiCall(request) {
    return `API.${request.method.name}(${JSON.stringify(request.params)})`;
}
