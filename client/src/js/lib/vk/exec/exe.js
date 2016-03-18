'use strict';

import {execute} from '../request';

import {exec} from './exec';

export function exe(requests) {
    let code = `return [${requests.map(getApiCall).join()}];`;
    let request = execute(code);

    return exec(request);
}

function getApiCall(request) {
    return `API.${request.method.name}(${JSON.stringify(request.params)})`;
}
