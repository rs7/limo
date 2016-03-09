'use strict';

let fs = require('fs');

import {pfx, listen as bind} from './config';
import {app} from './express';

let http = require('http');
let https = require('https');

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
