'use strict';

import async from 'async-q';

import * as model from './model';
import {uniqueFilter, mapById, auto} from './util';

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

export function getHistory(page = 0) {
    return auto({
        history: () => model.getHistory(page),

        usersList: ['history', ({history}) => history.map(like => like.user).filter(uniqueFilter)],

        photosList: ['history', ({history}) => history.map(like => like.photo).filter(uniqueFilter)],

        users: ['usersList', ({usersList}) => model.getUsers(usersList)],

        photos: ['photosList', ({photosList}) => model.getPhotosByList(photosList)],

        photosMap: ['photos', ({photos}) => mapById(photos)],

        usersMap: ['users', ({users}) => mapById(users)],

        fillHistory: ['history', 'photosMap', 'usersMap', ({history, photosMap, usersMap}) => history.map(
            ({user, photo, date}) => ({
                user: usersMap.get(user),
                photo: photosMap.get(photo),
                date
            })
        )]
    }, {
        returnTask: 'fillHistory',
        log: false
    });
}
