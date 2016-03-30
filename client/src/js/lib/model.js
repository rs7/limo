'use strict';

import {user, apiResult} from './params';

import {processArray, parseDate, parseObjectId} from './util';

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
        return [];
    }

    return execute(vk.getPhotosByList(photos)).catch(error => {
        if (error.error_code == 200) {
            //Код 200 возвращается, если все фотографии в запрашиваемом списке удалены
            return [];
        }

        throw error;
    }).then(responsePhotos => {
        //В запрашиваемом списке были удалённые фотографии, добавляем заглушку вместо них

        //todo: Отрефакторить это место
        if (responsePhotos.length < photos.length) {
            let responsePhotosList = responsePhotos.map(photo => photo.id);
            let deletedPhotos = photos.filter(photo => !responsePhotosList.includes(photo));
            Array.prototype.push.apply(responsePhotos, deletedPhotos.map(photo => ({
                id: photo,
                owner_id: user,
                photo_130: '//vk.com/images/camera_100.png'
            })));
        }

        return responsePhotos;
    });
}

export function getLikes(photo) {
    return aggregate(vk.getLikes(photo), execute);
}

export function getUsers(users) {
    if (users.isEmpty()) {
        return [];
    }

    return execute(vk.getUsers(users));
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
