'use strict';

import {listen} from './server';

import {authCheck, isString} from './util';
import {app} from './express';

import {routes} from './routes/index';

app.use(function (req, res, next) {
    if (['/rec', '/rtrg.jpg'].indexOf(req.originalUrl) != -1) {
        return next();
    }

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
    if (['/rec', '/rtrg.jpg'].indexOf(req.originalUrl) != -1) {
        return next();
    }

    let {user, auth} = req.query;

    if (authCheck(user, auth)) {
        next();
        return;
    }

    next({message: 'Не пройдена аутентификации'});
});

routes(app);

app.use(function (error, req, res, next) {
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
