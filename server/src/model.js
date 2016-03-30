'use strict';

import {User, Feed, objectId, renameId} from './db';

export function getFeed({user, from}) {
    let query = {
        owner: user
    };

    if (from) {
        Object.assign(query, {_id: {$lt: objectId(from)}});
    }

    return Feed.find(query).sort({_id: -1}).limit(10).lean().exec().then(feeds => feeds.map(renameId));
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
                friends: [],
                subscriptions: [],
                followers: [],
                likes: []
            }
        });
    }
}
