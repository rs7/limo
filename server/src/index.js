'use strict';

import {listen} from './server';

import {authCheck} from './util';
import {app} from './express';

app.use(function (req, res, next) {
    req.check('auth').isAuthKey();
    req.check('user').isUser();

    let errors = req.validationErrors();

    if (errors) {
        res.status(400).json({error: {message: 'Ошибка валидации параметров', debug: errors}});
        return;
    }

    next();
});

app.use(function (req, res, next) {
    let {user, auth} = req.query;

    if (authCheck(user, auth)) {
        return next();
    }

    res.status(403).json({error: {message: 'Ошибка авторизации', debug: {user, auth}}});
});

app.use(function (err, req, res, next) {
    res.status(500).json({error: err.message});
});

import {feed, snapshot} from './routes/index';

app.use(feed);
app.use(snapshot);

listen();
