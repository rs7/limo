'use strict';

const fs = require('fs');
const http = require('http');
const https = require('https');

import {pfx, listen as bind} from './config';
import {app} from './express';

console.log('Сертификат:', pfx.path);

let httpsOptions = {
    pfx: fs.readFileSync(pfx.path),
    passphrase: pfx.pass
};

export function listen() {
    listenServer(http.createServer(app), bind.http);
    listenServer(https.createServer(httpsOptions, app), bind.https);
    return app;
}

function listenServer(server, port) {
    server.listen(port, () => {
        console.log('Слушаю', server.address().port);
    });
}
