'use strict';

const async = require('async-q');

import {uniqueFilter, auto, processArray} from './util';

import * as model from './model';

export function saveSnapshot() {
    return auto({
        albums: () => model.getAlbums().then(response => response.items),

        photos: ['albums', ({albums}) => async.map(
            albums.filter(album => album.size > 0).map(album => album.id),
            model.getPhotos
        ).then(responses => Array.prototype.concat.apply([], responses.map(response => response.items)))],

        photosList: ['photos', ({photos}) => photos.map(photo => photo.id)],

        photosWithLikes: ['photos', ({photos}) => photos.filter(photo => photo.likes.count > 0).map(photo => photo.id)],

        likes: ['photosWithLikes', ({photosWithLikes}) => async.map(photosWithLikes, model.getLikes)],

        friends: () => model.getFriends().then(response => response.items),
        subscriptions: () => model.getSubscriptions().then(response => response.items),
        followers: () => model.getFollowers().then(response => response.items),

        snapshot: ['photosList', 'photosWithLikes', 'likes', 'friends', 'subscriptions', 'followers',
            ({photosList, photosWithLikes, likes, friends, subscriptions, followers}) => ({
                photos: photosList,
                friends,
                subscriptions,
                followers,
                likes: photosWithLikes.map((photo, index) => ({
                    photo,
                    likes: likes[index].items
                }))
            })
        ],

        save: ['snapshot', ({snapshot}) => model.setSnapshot(snapshot)]
    }, {
        returnTask: 'save'
        //, log: true
    });
}

export function getFeeds(from) {
    return auto({
        feeds: () => model.getFeeds(from),

        photos: ['feeds', ({feeds}) => {
            let photos = feeds.filter(feed => feed.photo).map(like => like.photo).filter(uniqueFilter);

            return model.getPhotosByList(photos).then(photos => mapById(photos));
        }],

        users: ['feeds', ({feeds}) => {
            let users = feeds.filter(feed => feed.user).map(like => like.user).filter(uniqueFilter);

            return model.getUsers(users).then(users => mapById(users));
        }],

        fillFeeds: ['feeds', 'photos', 'users', ({feeds, photos, users}) =>
            processArray(feeds, {
                user: user => users.get(user),
                photo: photo => photos.get(photo)
            })
        ]
    }, {
        returnTask: 'fillFeeds'
        //, log: true
    });
}

function mapById(array) {
    return new Map(array.map(item => [item.id, item]));
}
