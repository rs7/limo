import {getUrlVars} from './util';

const runParams = getUrlVars();

export let authKey = runParams.auth_key;

export let user = parseInt(runParams.viewer_id);

export let protocol = ['http', 'https'][runParams.is_secure];
