'use strict';

let express = require('express');

export let router = express.Router();

import {getUser, addFeeds} from '../model';

router.post('/snapshot', function (req, res, next) {
    req.checkBody('snapshot').isSnapshot();
    req.checkQuery('user').isUser();

    let errors = req.validationErrors();

    if (errors) {
        res.status(400).json({error: {message: 'Ошибка валидации параметров', debug: errors}});
        return;
    }

    let {snapshot} = req.body;
    let {user} = req.query;

    getUser(user).then(user => {
        let feeds = createFeeds(user.id, user.snapshot, {
            date: new Date(),
            items: snapshot
        });

        user.snapshot.items = snapshot.filter(item => item.likes.length > 0);
        user.snapshot.date = new Date();

        return addFeeds(feeds).then(() => user.save());
    }).catch(next).then(() =>
        res.json({response: 1}
    ));
});

let diff = require('simple-array-diff');

function createFeeds(owner, from, to) {
    let period = {
        from: from.date,
        to: to.date
    };

    let fromList = from.items.map(item => item.photo);
    let toList = to.items.map(item => item.photo);

    let fromMap = mapByPhoto(from.items);
    let toMap = mapByPhoto(to.items);

    let feeds = [];

    let com = diff(fromList, toList).common;

    com.forEach(photo => {
        let fromLikes = fromMap.get(photo).likes;
        let toLikes = toMap.get(photo).likes;

        let unlikes = diff(fromLikes, toLikes).removed;

        unlikes.forEach(user =>
            feeds.push({
                photo,
                user,
                period,
                owner
            })
        );
    });

    return feeds;

    function mapByPhoto(array) {
        return new Map(array.map(item => [item.photo, item]));
    }
}
