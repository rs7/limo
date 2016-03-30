'use strict';

import {User, Feed, validateObjectId, objectId} from './db';

export function getFeed({user, from}) {
    let query = {
        owner: user
    };

    if (from) {
        Object.assign(query, {_id: {$lt: objectId(from)}});
    }

    return Feed.find(query).sort({_id: -1}).limit(10).exec();
}

export function addFeeds(feeds) {
    if (feeds.length == 0) {
        return Promise.resolve();
    }

    return Feed.insertMany(feeds);
}

export function getUser(user) {
    return User.findOne({id: user}).then(userDoc => userDoc || createUser(user));

    function createUser(user) {
        return new User({
            id: user,
            snapshot: {
                date: new Date(0),
                photos: [],
                likes: []
            }
        });
    }
}
