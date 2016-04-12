'use strict';

import {User, Feed, Rec, objectId, renameId} from './db';

const pageSize = 10;

export function getFeedsPage({user, from}) {
    let query = {
        owner: user
    };

    if (from) {
        Object.assign(query, {
            _id: {
                $lte: objectId(from)
            }
        });
    }

    return Feed.find(query).sort({_id: -1}).limit(pageSize + 1).lean().exec().then(feeds => ({
        feeds: feeds.slice(0, pageSize).map(renameId),
        next: feeds[pageSize] && feeds[pageSize]._id
    }));
}


export function checkNewFeeds({user, to}) {
    let query = {
        owner: user
    };

    if (to) {
        Object.assign(query, {
            _id: {
                $gt: objectId(to)
            }
        });
    }

    return Feed.find(query).sort({_id: 1}).lean().exec().then(feeds => ({
        feeds: feeds.map(renameId)
    }));
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
                friends: [],
                followers: [],
                subscriptions: [],
                photos: [],
                photosLikes: [],
                posts: [],
                postsLikes: []
            }
        });
    }
}

export function saveRec(rec) {
    return Rec.collection.insert(rec);
}
