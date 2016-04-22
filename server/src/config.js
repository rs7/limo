'use strict';

let nconf = require('nconf');
let path = require('path');

let configPath = path.join(__dirname, './../../config.json');

console.log('Файл конфигурации:', configPath);

nconf.file({file: configPath});

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
