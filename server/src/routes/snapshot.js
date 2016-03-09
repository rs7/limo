'use strict';

let express = require('express');

export let router = express.Router();

import {User} from '../db';

router.post('/api', function (req, res, next) {
    var input = req.body;

    var userId = input.user_id;
    var snapshot = {
        date: new Date(),
        items: input.snapshot
    };

    User.findOne({id: userId}, function (err, user) {
        if (err) return next(err);

        if (!user) {
            user = new User({
                id: userId,
                snapshot: {
                    date: new Date(0),
                    items: []
                },
                history: []
            });
        }

        var history = createHistory(user.snapshot, snapshot);

        history.forEach(function (like) {
            user.history.unshift(like);
        });

        snapshot.items = snapshot.items.filter(function (item) {
            return item.likes.length > 0;
        });

        user.snapshot = snapshot;
        user.last_seen = new Date();

        user.save(function (err) {
            if (err) return next(err);

            res.json({response: 1});
        });
    });
});

let diff = require('simple-array-diff');

function createHistory(from, to) {
    let period = {
        from: from.date,
        to: to.date
    };

    let fromList = from.items.map(item => item.photo);
    let toList = to.items.map(item => item.photo);

    let fromMap = mapByPhoto(from.items);
    let toMap = mapByPhoto(to.items);

    let history = [];

    let com = diff(fromList, toList).common;

    com.forEach(photo => {
        let fromLikes = fromMap.get(photo).likes;
        let toLikes = toMap.get(photo).likes;

        let unlikes = diff(fromLikes, toLikes).removed;

        unlikes.forEach(user =>
            history.push({
                photo: photo,
                user: user,
                period: period
            })
        );
    });

    return history;

    function mapByPhoto(array) {
        return new Map(array.map(item => [item.photo, item]));
    }
}
