import * as request from './request';

export let getPhotos = request.getPhotos;

export function getPhotosByList(photos) {
    return (photos.length > 0) ? request.getPhotosByList(photos) : [];
}

export let getLikes = request.getLikes;

export function getUsers(users) {
    return (users.length > 0) ? request.getUsers(users) : [];
}

export let setSnapshot = request.setSnapshot;

export function getHistory(page) {
    return request.getHistory(page).then(items =>
        items.map(
            ({user, photo, date}) => ({
                user,
                photo,
                date:new Date(date)
            })
        )
    );
}
