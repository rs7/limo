'use strict';

import {execute} from '../vk_request';

export function compose(requests) {
    let code = `return [${requests.map(getApiCall).join()}];`;
    let request = execute(code);

    return request;
}

function getApiCall(request) {
    return `API.${request.method.name}(${JSON.stringify(request.params)})`;
}
