'use strict';

import {user, apiResult} from './../params';

import {parseDate, parseObjectId} from './../util/parse';
import {processArray, processObject} from './../util/process';
import {execute} from './../vk/execute/autoExecutor';
import {aggregate} from './../vk/listAggregator';

import * as remote from './../back/request';
import * as vk from './../vk/request';

export function getAlbums() {
    return execute(vk.getAlbums());
}

export function getPhotos(album) {
    return aggregate(vk.getPhotos(album), execute);
}

export function getUsers(users, fields, nameCase) {
    return execute(vk.getUsers(users, fields, nameCase));
}

export function getPhotosByList(photos) {
    return execute(vk.getPhotosByList(photos)).catch(
        error => {
            if (error.error_code == 200) {
                //Код 200 возвращается, если все фотографии в запрашиваемом списке удалены
                return [];
            }

            throw error;
        }
    );
}

export function getPhotoLikes(photo) {
    return aggregate(vk.getPhotoLikes(photo), execute);
}

export function getPostLikes(post) {
    return aggregate(vk.getPostLikes(post), execute);
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

export function getPostsByList(posts) {
    return execute(vk.getPostsByList(posts));
}
