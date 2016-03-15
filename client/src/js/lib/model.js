'use strict';

import * as request from './request';

import {user} from './params';

import {processArray, parseDate} from './util';

export let getPhotos = request.getPhotos;

export function getPhotosByList(photos) {
    if (photos.length == 0) {
        return [];
    }

    return request.getPhotosByList(photos).catch(error => {
        if (error.error_code == 200) {
            //Код 200 возвращается, если все фотографии в запрашиваемом списке удалены
            return [];
        }

        throw error;
    }).then(responsePhotos => {
        //В запрашиваемом списке были удалённые фотографии, добавляем заглушку вместо них
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

export let getLikes = request.getLikes;

export function getUsers(users) {
    return (users.length > 0) ? request.getUsers(users) : [];
}

export let setSnapshot = request.setSnapshot;

export function getFeeds(page) {
    return request.getFeeds(page).then(feeds => processArray(feeds, {
        period: {
            from: parseDate,
            to: parseDate
        }
    }));
}
