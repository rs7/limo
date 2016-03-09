'use strict';

import {listen} from './server';

import {authCheck} from './util';
import {app} from './express';

app.use(function (req, res, next) {
    if (authCheck(req.body.user_id, req.body.auth_key)) {
        return next();
    }

    if (authCheck(req.query.user_id, req.query.auth_key)) {
        return next();
    }

    res.status(403).json({error: 'auth error'});
});

app.use(function (err, req, res, next) {
    res.status(500).json({error: err.message});
});

import {history, snapshot} from './routes/index';

app.use(history);
app.use(snapshot);

listen();
