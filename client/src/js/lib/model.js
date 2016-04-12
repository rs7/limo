'use strict';

import {user, apiResult} from './params';

import {processArray, processObject, parseDate, parseObjectId} from './util';

import * as async from './async';

import * as vk from './vk/request';
import * as remote from './remote/request';

import {execute} from './vk/execute/autoExecutor';

import {aggregate} from './vk/listAggregator';

export function getAlbums() {
    return execute(vk.getAlbums());
}

export function getPhotos(album) {
    return aggregate(vk.getPhotos(album), execute);
}

let photosCache = new Map();

export function getPhotosByList(photos) {
    if (photos.isEmpty()) {
        return Promise.resolve([]);
    }

    let newcomers = photos.filter(photo => !photosCache.has(photo));

    return getPhotos(newcomers).then(
        newcomers => newcomers.forEach(photo => photosCache.set(photo.id, photo))
    ).then(
        () => photos.map(photo => photosCache.get(photo))
    );

    function getPhotos(photos) {
        if (photos.isEmpty()) {
            return Promise.resolve([]);
        }

        return execute(vk.getPhotosByList(photos)).catch(error => {
            if (error.error_code == 200) {
                //Код 200 возвращается, если все фотографии в запрашиваемом списке удалены
                return [];
            }

            throw error;
        }).then(response => {
            if (response.length == photos.length) {
                return response;
            }

            //В запрашиваемом списке были удалённые фотографии, добавляем заглушку вместо них

            let responseList = response.map(photo => photo.id);
            let deleted = photos.filter(photo => !responseList.includes(photo));
            Array.prototype.push.apply(response, deleted.map(photo => deletedPhoto(photo)));

            return response;
        });
    }

    function deletedPhoto(photo) {
        return {
            id: photo,
            owner_id: user,
            photo_130: '//vk.com/images/camera_100.png'
        };
    }
}

export function getPhotoLikes(photo) {
    return aggregate(vk.getPhotoLikes(photo), execute);
}

export function getPostLikes(post) {
    return aggregate(vk.getPostLikes(post), execute);
}

let usersCache = new Map();

export function getUsers(users) {
    if (users.isEmpty()) {
        return Promise.resolve([]);
    }

    const nameCaseFields = ['first_name', 'last_name'];

    let newcomers = users.filter(user => !usersCache.has(user));

    return async.auto({
        users: () => getUsers(newcomers, ['photo_50', 'domain', 'sex'], 'nom'),

        usersDat: () => getUsers(newcomers, [], 'dat'),

        newcomers: ['users', 'usersDat', ({users, usersDat}) =>
            users.map((user, index) => fill(Object.assign({}, user, usersDat[index])))
        ],

        save: ['newcomers', ({newcomers}) => newcomers.forEach(user => usersCache.set(user.id, user))],

        result: ['save', () => users.map(user => usersCache.get(user))]
    });

    function fill(user) {
        nameCaseFields.forEach(field => Object.defineProperty(user, field, {
            get: () => this[`${field}_nom`]
        }));
        return user;
    }

    function getUsers(users, fields, nameCase) {
        if (users.isEmpty()) {
            return Promise.resolve([]);
        }

        return execute(vk.getUsers(users, fields, nameCase)).then(
            users => users.map(user => processNameCase(user, nameCase))
        );
    }

    function processNameCase(user, nameCase) {
        let processedUser = Object.assign({}, user);

        nameCaseFields.forEach(field => {
            processedUser[`${field}_${nameCase}`] = user[field];
            delete processedUser[field];
        });

        return processedUser;
    }
}

export function setSnapshot(snapshot) {
    return remote.setSnapshot(snapshot);
}

export function getFeeds({from}) {
    return remote
        .getFeeds(from && from.value)
        .then(processFeedsResponse)
    ;
}

export function getNewFeeds({to}) {
    return remote
        .getNewFeeds(to && to.value)
        .then(processFeedsResponse)
    ;
}

function processFeedsResponse(response) {
    return processObject(response, {
        feeds: processFeeds,
        next: parseObjectId
    });

    function processFeeds(feeds) {
        return processArray(feeds, {
            id: parseObjectId,
            period: {
                from: parseDate,
                to: parseDate
            }
        });
    }
}

export function getLastSeen() {
    //return parseObjectId('57061f04d0f0aa081b4be932');
    //return parseObjectId('');
    return parseObjectId(apiResult);
}

export function setLastSeen(id) {
    return execute(vk.storageSet('lastSeen', id.value));
}

export function getFriends() {
    return execute(vk.getFriends());
}

export function getSubscriptions() {
    return aggregate(vk.getSubscriptions(), execute);
}

export function getFollowers() {
    return aggregate(vk.getFollowers(), execute);
}

export function getPosts() {
    return aggregate(vk.getPosts(), execute);
}

let postsCache = new Map();

export function getPostsByList(posts) {
    if (posts.isEmpty()) {
        return Promise.resolve([]);
    }

    let newcomers = posts.filter(post => !postsCache.has(post));

    return getPosts(newcomers).then(
        newcomers => newcomers.forEach(post => postsCache.set(post.id, post))
    ).then(
        () => posts.map(post => postsCache.get(post))
    );

    function getPosts(posts) {
        if (posts.isEmpty()) {
            return Promise.resolve([]);
        }

        return execute(vk.getPostsByList(posts)).then(response => {
            if (response.length == posts.length) {
                return response;
            }

            //В запрашиваемом списке были удалённые посты, добавляем заглушку вместо них

            let responseList = response.map(post => post.id);
            let deleted = posts.filter(post => !responseList.includes(post));
            Array.prototype.push.apply(response, deleted.map(post => deletedPost(post)));

            return response;
        });
    }

    function deletedPost(post) {
        return {
            id: post
        };
    }
}
