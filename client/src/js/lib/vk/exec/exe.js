'use strict';

import {execute} from '../request';

import {sdk} from './sdk';

export function exe(requests) {
    console.log('exe', requests);

    let code = `return [${requests.map(getApiCall).join()}];`;
    let request = execute(code);

    return sdk(request);
}

function getApiCall(request) {
    return `API.${request.method.name}(${JSON.stringify(request.params)})`;
}
