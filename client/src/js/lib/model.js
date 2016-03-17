'use strict';

import {user, apiResult} from './params';

import {processArray, parseDate, parseObjectId} from './util';

import * as vkexec from './vk/exec';
import * as vkr from './vk/request';
import {fetchAll} from './vk/fetch';

import * as remote from './remote/request';

export function getPhotos() {
    return fetchAll(vkr.getPhotos(), vkexec.pub);
}

export function getPhotosByList(photos) {
    if (photos.isEmpty()) {
        return [];
    }

    return vkexec.pub(vkr.getPhotosByList(photos)).catch(error => {
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
    return fetchAll(vkr.getLikes(photo), vkexec.pub);
}

export function getUsers(users) {
    if (users.isEmpty()) {
        return [];
    }

    return vkexec.pub(vkr.getUsers(users));
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
    return vkexec.priv(vkr.storageSet('lastSeen', id.value));
}
