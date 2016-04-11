'use strict';

let express = require('express');

export let router = express.Router();

import {getUser, addFeeds} from './../model';

router.post('/snapshot', function (req, res, next) {
    req.checkQuery('user', 'Недопустимый идентификатор пользователя').isUser();

    req.checkBody('friends', 'Недопустимый снимок данных').isUsers();
    req.checkBody('subscriptions', 'Недопустимый снимок данных').isUsers();
    req.checkBody('followers', 'Недопустимый снимок данных').isUsers();
    req.checkBody('photos', 'Недопустимый снимок данных').isPhotos();
    req.checkBody('photosLikes', 'Недопустимый снимок данных').isPhotosLikes();
    req.checkBody('posts', 'Недопустимый снимок данных').isPosts();
    req.checkBody('postsLikes', 'Недопустимый снимок данных').isPostsLikes();

    let errors = req.validationErrors();

    if (errors) {
        next({message: 'Недопустимые параметры', errors});
        return;
    }

    let {friends, subscriptions, followers, photos, photosLikes, posts, postsLikes} = req.body;
    let {user} = req.query;

    let snapshot = {friends, subscriptions, followers, photos, photosLikes, posts, postsLikes};

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

    let type;

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

    type = 'unlike_photo';

    let photosFromMap = mapByPhoto(from.photosLikes);
    let photosToMap = mapByPhoto(to.photosLikes);

    let commonPhotos = diff(from.photos, to.photos).common;

    commonPhotos.forEach(photo => {
        let fromLikes = photosFromMap.get(photo) && photosFromMap.get(photo).likes || [];
        let toLikes = photosToMap.get(photo) && photosToMap.get(photo).likes || [];

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

    type = 'unlike_post';

    let postsFromMap = mapByPost(from.postsLikes);
    let postsToMap = mapByPost(to.postsLikes);

    let commonPosts = diff(from.posts, to.posts).common;

    commonPosts.forEach(post => {
        let fromLikes = postsFromMap.get(post) && postsFromMap.get(post).likes || [];
        let toLikes = postsToMap.get(post) && postsToMap.get(post).likes || [];

        let unlikes = diff(fromLikes, toLikes).removed;

        unlikes.forEach(user =>
            feeds.push({
                type,
                post,
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

    function mapByPost(array) {
        return new Map(array.map(item => [item.post, item]));
    }
}
