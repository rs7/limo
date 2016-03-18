'use strict';

import {user, apiResult} from './params';

import {processArray, parseDate, parseObjectId} from './util';

import * as vk from './vk/request';
import * as remote from './remote/request';

import {exec} from './vk/exec/exec';

import * as list from './vk/list';

export function getPhotos() {
    return list.get(vk.getPhotos(), exec);
}

export function getPhotosByList(photos) {
    if (photos.isEmpty()) {
        return [];
    }

    return exec(vk.getPhotosByList(photos)).catch(error => {
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
    return list.get(vk.getLikes(photo), exec);
}

export function getUsers(users) {
    if (users.isEmpty()) {
        return [];
    }

    return exec(vk.getUsers(users));
}

export function setSnapshot(snapshot) {
    return remote.setSnapshot(snapshot);
}

export function getFeeds(from) {
    return remote.getFeeds(from && from.value).then(feeds => processArray(feeds, {
        id: parseObjectId,
        period: {
            from: parseDate,
            to: parseDate
        }
    }));
}

export function getLastSeen() {
    return apiResult;
}

export function setLastSeen(id) {
    return exec(vk.storageSet('lastSeen', id.value));
}
