'use strict';

let express = require('express');

export let router = express.Router();

import {getFeed} from '../model';

router.get('/feed', function (req, res, next) {
    req.checkQuery('from').optional().isFrom();

    let errors = req.validationErrors();

    if (errors) {
        res.status(400).json({error: {message: 'Ошибка валидации параметров', debug: errors}});
        return;
    }

    let {user, from} = req.query;

    getFeed({user, from}).then(feeds => {
        res.json({response: feeds});
    }).catch(next);
});
