'use strict';

let express = require('express');

export let router = express.Router();

import {getFeedsPage, checkNewFeeds} from './../model';

router.get('/feed', function (req, res, next) {
    req.checkQuery('from').optional().isObjectId();

    let errors = req.validationErrors();

    if (errors) {
        res.status(400).json({error: {message: 'Ошибка валидации параметров', debug: errors}});
        return;
    }

    let {user, from} = req.query;

    getFeedsPage({user, from}).then(feeds => {
        res.json({response: feeds});
    }).catch(next);
});

router.get('/feed/new', function (req, res, next) {
    req.checkQuery('to').optional().isObjectId();

    let errors = req.validationErrors();

    if (errors) {
        res.status(400).json({error: {message: 'Ошибка валидации параметров', debug: errors}});
        return;
    }

    let {user, to} = req.query;

    checkNewFeeds({user, to}).then(feeds => {
        res.json({response: feeds});
    }).catch(next);
});
