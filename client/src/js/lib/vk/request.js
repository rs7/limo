'use strict';

import {user} from '../params';

function vkr(method, params, options) {
    return {
        method,
        params,
        options
    };
}

export function getPhotos() {
    return vkr('photos.get', {
        owner_id: user,
        album_id: 'profile',
        rev: 1,
        count: 1000
    }, {
        public: 1
    });
}

export function getPhotosByList(photos) {
    return vkr('photos.getById', {
        photos: photos.map(photo => `${user}_${photo}`)
    }, {
        https: 1,
        public: 1
    });
}

export function getLikes(photo) {
    return vkr('likes.getList', {
        type: 'photo',
        owner_id: user,
        item_id: photo,
        count: 1000
    }, {
        public: 1
    });
}

export function getUsers(users) {
    return vkr('users.get', {
        user_ids: users.join(),
        fields: ['photo_50', 'domain'].join(),
        name_case: 'dat',
        count: 1000
    }, {
        lang: 1,
        public: 1
    });
}

export function storageSet(key, value) {
    return vkr('storage.set', {
        key,
        value
    });
}
