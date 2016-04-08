'use strict';

let express = require('express');

export let router = express.Router();

import {getFeedsPage, checkNewFeeds} from './../model';

router.get('/feed', function (req, res, next) {
    req.checkQuery('from', 'Недопустимый идентификатор записи').optional().isFeedId();
    req.checkQuery('user', 'Недопустимый идентификатор пользователя').isUser();

    let errors = req.validationErrors();

    if (errors) {
        next({message: 'Недопустимые параметры', errors});
        return;
    }

    let {user, from} = req.query;

    getFeedsPage({user, from}).then(feeds => {
        res.json({response: feeds});
    }).catch(next);
});

router.get('/feed/new', function (req, res, next) {
    req.checkQuery('to', 'Недопустимый идентификатор записи').optional().isFeedId();
    req.checkQuery('user', 'Недопустимый идентификатор пользователя').isUser();

    let errors = req.validationErrors();

    if (errors) {
        next({message: 'Недопустимые параметры', errors});
        return;
    }

    let {user, to} = req.query;

    checkNewFeeds({user, to}).then(feeds => {
        res.json({response: feeds});
    }).catch(next);
});
