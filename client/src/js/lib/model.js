import * as request from './request';

export let getPhotos = request.getPhotos;

export let getPhotosByList = request.getPhotosByList;

export let getLikes = request.getLikes;

export let getUsers = request.getUsers;

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
