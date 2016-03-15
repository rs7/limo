'use strict';

import {listen} from './server';

import {authCheck} from './util';
import {app} from './express';

app.use(function (req, res, next) {
    let {user, auth:authKey} = Object.assign({}, req.body, req.query);

    if (authCheck(user, authKey)) {
        return next();
    }

    res.status(403).json({error: 'Ошибка авторизации'});
});

app.use(function (err, req, res, next) {
    res.status(500).json({error: err.message});
});

import {feed, snapshot} from './routes/index';

app.use(feed);
app.use(snapshot);

listen();
