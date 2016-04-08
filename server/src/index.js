'use strict';

import {listen} from './server';

import {authCheck, isString} from './util';
import {app} from './express';

import {feed, snapshot} from './routes/index';

app.use(function (req, res, next) {
    req.checkQuery('auth', 'Недопустимый ключ аутентификации').isAuthKey();
    req.checkQuery('user', 'Недопустимый идентификатор пользователя').isUser();

    let errors = req.validationErrors();

    if (errors) {
        next({message: 'Недопустимые параметры', errors});
        return;
    }

    next();
});

app.use(function (req, res, next) {
    let {user, auth} = req.query;

    if (authCheck(user, auth)) {
        next();
        return;
    }

    next({message: 'Не пройдена аутентификации'});
});

app.use(feed);
app.use(snapshot);

app.use(function (error, req, res, next) {
    /*if (error instanceof Error) {
        error = {
            message: error.message
        };
    }*/

    if (isString(error)) {
        error = {
            message: error
        };
    }

    Object.assign(error, {
        request: requestError(req)
    });

    res.json({error});
});

listen();

function requestError(req) {
    return {
        url: req.path,
        method: req.method,
        query: req.query,
        protocol: req.protocol
    };
}

Object.defineProperty(Error.prototype, 'toJSON', {
    configurable: true,
    value: function () {
        var alt = {};
        var storeKey = function (key) {
            alt[key] = this[key];
        };
        Object.getOwnPropertyNames(this).forEach(storeKey, this);
        return alt;
    }
});
