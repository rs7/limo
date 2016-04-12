'use strict';

import {getUrlVars} from './util';

const runParams = getUrlVars();

console.rec({runParams});

export let authKey = runParams.auth_key;

export let user = +runParams.viewer_id;

export let isSecure = +runParams.is_secure;

export let protocol = ['http', 'https'][isSecure];

export let accessToken = runParams.access_token;

export let apiResult = JSON.parse(decodeURIComponent(runParams.api_result)).response;

console.rec({apiResult});

export let language =  +runParams.language;
