'use strict';

let express = require('express');

export let router = express.Router();

import {getUser, addFeeds} from './../model';

router.post('/snapshot', function (req, res, next) {
    req.checkQuery('user', 'Недопустимый идентификатор пользователя').isUser();

    req.checkBody('photos', 'Недопустимый снимок данных').isPhotos();
    req.checkBody('likes', 'Недопустимый снимок данных').isLikes();
    req.checkBody('friends', 'Недопустимый снимок данных').isUsers();
    req.checkBody('subscriptions', 'Недопустимый снимок данных').isUsers();
    req.checkBody('followers', 'Недопустимый снимок данных').isUsers();

    let errors = req.validationErrors();

    if (errors) {
        next({message: 'Недопустимые параметры', errors});
        return;
    }

    let {photos, likes, friends, subscriptions, followers} = req.body;
    let {user} = req.query;

    let snapshot = {photos, likes, friends, subscriptions, followers};

    Object.assign(snapshot, {
        date: new Date()
    });

    getUser(user).then(user => {
        let feeds = createFeeds(user.id, user.snapshot, snapshot);

        user.snapshot = snapshot;

        return addFeeds(feeds).then(() => user.save());
    }).catch(next).then(() =>
        res.json({response: 1})
    );
});

let diff = require('simple-array-diff');

function createFeeds(owner, from, to) {
    let period = {
        from: from.date,
        to: to.date
    };

    let feeds = [];

    let type = 'unlike_photo';

    let fromMap = mapByPhoto(from.likes);
    let toMap = mapByPhoto(to.likes);

    let commonPhotos = diff(from.photos, to.photos).common;

    commonPhotos.forEach(photo => {
        let fromLikes = fromMap.get(photo) && fromMap.get(photo).likes || [];
        let toLikes = toMap.get(photo) && toMap.get(photo).likes || [];

        let unlikes = diff(fromLikes, toLikes).removed;

        unlikes.forEach(user =>
            feeds.push({
                type,
                photo,
                user,
                period,
                owner
            })
        );
    });

    type = 'unfriend';

    let unfriended = diff(from.friends, to.friends).removed.filter(user => to.followers.indexOf(user) == -1);

    unfriended.forEach(user =>
        feeds.push({
            type,
            owner,
            user,
            period
        })
    );

    type = 'unfollower';

    let unfollowered = diff(from.followers, to.followers).removed.filter(user => to.friends.indexOf(user) == -1);

    unfollowered.forEach(user =>
        feeds.push({
            type,
            owner,
            user,
            period
        })
    );

    return feeds;

    function mapByPhoto(array) {
        return new Map(array.map(item => [item.photo, item]));
    }
}
