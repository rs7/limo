'use strict';

import {uniqueFilter} from './../util/array';
import {processArray} from './../util/process';
import {mapById} from './../util/util';

import * as model from './../model/model';

import * as usersCache from './../model/users';
import * as photosCache from './../model/photos';
import * as postsCache from './../model/posts';

export function getFeedsFrom(from) {
    return model.getFeeds(from).transparent(
        ({feeds}) => console.rec({feeds, from})
    ).then(
        ({feeds, next}) => Promise.all([
            fillFeeds(feeds),
            next
        ]).then(
            ([feeds, next]) => ({
                feeds,
                next
            })
        )
    );
}

export function getFeedsTo(to) {
    return model.getNewFeeds(to).transparent(
        ({feeds}) => console.rec({feeds, to})
    ).then(
        ({feeds}) => fillFeeds(feeds)
    ).then(
        feeds => ({feeds})
    );
}

function fillFeeds(feeds) {
    let photos = feeds.filter(feed => feed.photo).map(like => like.photo).filter(uniqueFilter);
    let users = feeds.filter(feed => feed.user).map(like => like.user).filter(uniqueFilter);
    let posts = feeds.filter(feed => feed.post).map(like => like.post).filter(uniqueFilter);

    return Promise.all([
        feeds,
        usersCache.getUsers(users).then(users => mapById(users)),
        photosCache.getPhotos(photos).then(photos => mapById(photos)),
        postsCache.getPosts(posts).then(posts => mapById(posts))
    ]).then(
        ([feeds, users, photos, posts]) =>

        processArray(feeds, {
            user: user => users.get(user),
            photo: photo => photos.get(photo),
            post: post => posts.get(post)
        })
    ).transparent(
        fillFeeds => console.rec({fillFeeds})
    );
}
