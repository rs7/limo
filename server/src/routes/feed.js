'use strict';

let express = require('express');

export let router = express.Router();

import {getFeed} from '../model';
import {sliceObject} from '../util';

router.get('/feed', function (req, res, next) {
    req.checkQuery('from').optional().isFrom();

    let errors = req.validationErrors();

    if (errors) {
        res.status(400).json({error: {message: 'Ошибка валидации параметров', debug: errors}});
        return;
    }

    let {user, from} = req.query;

    const OUTPUT_KEYS = ['id', 'photo', 'user', 'period'];

    getFeed({user, from}).then(feeds => {
        let response = feeds.map(feed => sliceObject(feed, OUTPUT_KEYS));
        res.json({response});
    }).catch(next);
});
