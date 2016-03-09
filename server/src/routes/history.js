'use strict';

let express = require('express');

export let router = express.Router();

import {User} from '../db';

router.get('/api', function (req, res, next) {
    var input = req.query;

    var userId = input.user_id;
    var page = input.page;

    User.findOne({id: userId}, function (err, user) {
        if (err) return next(err);

        if (!user) {
            res.status(404).json({error: 'not fount user'});
            return;
        }

        var count = 10;
        var offset = page * count;
        var history = user.history.slice(offset, offset + count).map(function (like) {
            return {
                id: like._id.valueOf(),
                photo: like.photo,
                user: like.user,
                date: like.date,
                period: like.period
            };
        });

        res.json({response: history});
    });
});
