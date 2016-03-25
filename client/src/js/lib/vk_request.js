'use strict';

import {user} from './params';

import {API} from './vk/api';

function create(method, params, options) {
    return {
        method,
        params,
        options
    }
}

export function getPhotos() {
    return create(API.photos.get, {
        owner_id: user,
        album_id: 'profile',
        rev: 1
    });
}

export function getAllPhotos() {
    return create(API.photos.getAll, {
        owner_id: user
    });
}

export function getPhotosByList(photos) {
    return create(API.photos.getById, {
        photos: photos.map(photo => `${user}_${photo}`)
    }, {
        https: 1
    });
}

export function getLikes(photo) {
    return create(API.likes.getList, {
        type: 'photo',
        owner_id: user,
        item_id: photo
    });
}

export function getUsers(users) {
    return create(API.users.get, {
        user_ids: users.join(),
        fields: ['photo_50', 'domain'].join(),
        name_case: 'dat'
    }, {
        lang: 1
    });
}

export function storageSet(key, value) {
    return create(API.storage.set, {
        key,
        value
    });
}

export function execute(code) {
    return create(API._.execute, {code});
}
