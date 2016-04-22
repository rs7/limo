'use strict';

let nconf = require('nconf');

nconf.file({file: './build/config.json'});

export let appId = nconf.get('app:id');

export let secretKey = nconf.get('app:secret');

export let pfx = {
    path: nconf.get('pfx:path'),
    pass: nconf.get('pfx:pass')
};

export let listen = {
    http: nconf.get('listen:http'),
    https: nconf.get('listen:https')
};

export let db = {
    uri: nconf.get('db:uri'),
    user: nconf.get('db:user'),
    pass: nconf.get('db:pass')
};
