'use strict';

import {user} from './../params';

import * as model from './model';

import {complete} from './complete';
import {Cache} from './cache';

let cache = new Cache(getPhotosWorker);

export function getPhotos(photos) {
    return cache.get(photos);
}

function getPhotosWorker(photos) {
    return model.getPhotosByList(photos).then(results => complete(photos, results, deletedPhoto));
}

function deletedPhoto(photo) {
    return {
        id: photo,
        owner_id: user,
        photo_130: '//vk.com/images/camera_100.png'
    };
}
