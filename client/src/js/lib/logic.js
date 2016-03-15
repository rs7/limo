'use strict';

import async from 'async-q';

import * as model from './model';
import {uniqueFilter, mapById, auto, processArray} from './util';

export function saveSnapshot() {
    return auto({
        photos: model.getPhotos,

        photosList: ['photos', ({photos:{items:photos}}) => photos.map(photo => photo.id)],

        likes: ['photosList', ({photosList}) => async.map(photosList, model.getLikes)],

        snapshot: ['photosList', 'likes',
            ({photosList, likes}) => photosList.map((photo, index) => ({
                photo,
                likes: likes[index].items
            }))
        ],

        save: ['snapshot', ({snapshot}) => model.setSnapshot(snapshot)]
    }, {
        returnTask: 'save',
        log: false
    });
}

export function getFeeds(page = 0) {
    return auto({
        feeds: () => model.getFeeds(page),

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
        returnTask: 'fillFeeds',
        log: false
    });
}
