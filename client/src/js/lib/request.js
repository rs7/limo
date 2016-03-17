'use strict';

import {VK, Remote} from './remote';
import {user} from './params';

export function getPhotos() {
    return VK.public('photos.get', {
        owner_id: user,
        album_id: 'profile',
        rev: 1,
        count: 20
    });
}

export function getPhotosByList(photos) {
    var photosFullIds = photos.map((photo) => user + '_' + photo);

    return VK.public('photos.getById', {
        photos: photosFullIds
    },{
        https: 1
    });
}

export function getLikes(photo) {
    return VK.public('likes.getList', {
        type: 'photo',
        owner_id: user,
        item_id: photo,
        count: 1000
    });
}

export function getUsers(users) {
    return VK.public('users.get', {
        user_ids: users.join(),
        fields: ['photo_50', 'domain'].join(),
        name_case: 'dat',
        count: 1000
    },{
        lang: 1
    });
}

export function setSnapshot(snapshot) {
    return Remote.post('/snapshot', {user}, {snapshot});
}

export function getFeeds(from) {
    return Remote.get('/feed', {user, from});
}

export function storageSet(key, value) {
    return VK.private('storage.set', {key, value});
}
