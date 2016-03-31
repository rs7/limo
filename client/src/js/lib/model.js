'use strict';

import {user, apiResult} from './params';

import {processArray, parseDate, parseObjectId, auto} from './util';

import * as vk from './vk_request';
import * as remote from './remote/request';

import {execute} from './vk/execute/autoExecutor';

import {aggregate} from './vk/listAggregator';

export function getAlbums() {
    return execute(vk.getAlbums());
}

export function getPhotos(album) {
    return aggregate(vk.getPhotos(album), execute);
}

export function getPhotosByList(photos) {
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

    function deletedPhoto(photo) {
        return {
            id: photo,
            owner_id: user,
            photo_130: '//vk.com/images/camera_100.png'
        };
    }
}

export function getLikes(photo) {
    return aggregate(vk.getLikes(photo), execute);
}

export function getUsers(users) {
    if (users.isEmpty()) {
        return Promise.resolve([]);
    }

    return auto({
        users: () => execute(vk.getUsers(users, ['photo_50', 'domain', 'sex'], 'nom')),

        dats: () => execute(vk.getUsers(users, [], 'dat')),

        result: ['users', 'dats', ({users, dats}) =>
            users.map((user, index) => {
                let dat = dats[index];
                return Object.assign({}, user, {
                    first_name_dat: dat.first_name,
                    last_name_dat: dat.last_name
                });
            })
        ]
    });
}

export function setSnapshot(snapshot) {
    return remote.setSnapshot(snapshot);
}

export function getFeeds(from) {
    let fromValue = from && from.value;

    return remote
        .getFeeds(fromValue)
        .then(feeds => processArray(feeds, {
            id: parseObjectId,
            period: {
                from: parseDate,
                to: parseDate
            }
        }))
    ;
}

export function getLastSeen() {
    return apiResult;
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
