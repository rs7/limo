'use strict';

const async = require('async-q');

import {uniqueFilter, auto, processArray} from './util';

import * as model from './model';

export function saveSnapshot() {
    return auto({
        photos: model.getPhotos,

        photosList: ['photos', ({photos:{items:photos}}) => photos.map(photo => photo.id)],

        photosWithLikes: ['photos', ({photos:{items:photos}}) => photos.filter(photo => photo.likes.count > 0).map(photo => photo.id)],

        likes: ['photosWithLikes', ({photosWithLikes}) => async.map(photosWithLikes, model.getLikes)],

        snapshot: ['photosList', 'photosWithLikes', 'likes',
            ({photosList, photosWithLikes, likes}) => ({
                photos: photosList,
                likes: photosWithLikes.map((photo, index) => ({
                    photo,
                    likes: likes[index].items
                }))
            })
        ],

        save: ['snapshot', ({snapshot}) => model.setSnapshot(snapshot)]
    }, {
        returnTask: 'save'
        , log: true
    });
}

export function getFeeds(from) {
    return auto({
        feeds: () => model.getFeeds(from),

        usersList: ['feeds', ({feeds}) => feeds.map(like => like.user).filter(uniqueFilter)],

        photosList: ['feeds', ({feeds}) => feeds.map(like => like.photo).filter(uniqueFilter)],

        users: ['usersList', ({usersList}) => model.getUsers(usersList)],

        photos: ['photosList', ({photosList}) => model.getPhotosByList(photosList)],

        photosMap: ['photos', ({photos}) => mapById(photos)],

        usersMap: ['users', ({users}) => mapById(users)],

        fillFeeds: ['feeds', 'photosMap', 'usersMap', ({feeds, photosMap, usersMap}) =>
            processArray(feeds, {
                user: user => usersMap.get(user),
                photo: photo => photosMap.get(photo)
            })
        ]
    }, {
        returnTask: 'fillFeeds'
    });
}

function mapById(array) {
    return new Map(array.map(item => [item.id, item]));
}
