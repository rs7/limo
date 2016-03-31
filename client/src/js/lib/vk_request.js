'use strict';

import {user} from './params';

import {API} from './vk/api';

function create(method, params, options) {
    return {
        method,
        params,
        options
    };
}

export function getPhotos(album) {
    return create(API.photos.get, {
        album_id: album,
        extended: 1,
        rev: 1
    });
}

export function getAlbums() {
    return create(API.photos.getAlbums, {
        need_system: 1
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
        item_id: photo
    });
}

export function getUsers(users, fields, nameCase) {
    return create(API.users.get, {
        user_ids: users.join(),
        fields: fields.join(),
        name_case: nameCase
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

export function getFriends() {
    return create(API.friends.get);
}

export function getSubscriptions() {
    return create(API.subscriptions.get);
}

export function getFollowers() {
    return create(API.users.getFollowers);
}
