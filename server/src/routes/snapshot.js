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

    Object.assign(snapshot, {
        date: new Date()
    });

    getUser(user).then(user => {
        let feeds = createFeeds(user.id, user.snapshot, snapshot);

        user.snapshot = snapshot;

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

    let fromMap = mapByPhoto(from.likes);
    let toMap = mapByPhoto(to.likes);

    let commonPhotos = diff(from.photos, to.photos).common;

    let feeds = [];

    commonPhotos.forEach(photo => {
        let fromLikes = fromMap.get(photo) && fromMap.get(photo).likes || [];
        let toLikes = toMap.get(photo) && toMap.get(photo).likes || [];

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
