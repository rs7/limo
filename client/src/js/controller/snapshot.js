'use strict';

import {concat} from './../util/array';

import * as model from './../model/model';

export function getSnapshot() {
    return Promise.all([
        getFriendsLists().transparent(friendsLists => console.rec({friendsLists})),
        getPhotosObject().transparent(photosObject => console.rec({photosObject})),
        getPostsObject().transparent(postsObject => console.rec({postsObject}))
    ]).then(
        ([
            {friends, followers, subscriptions},
            {photos, photosLikes},
            {posts, postsLikes}
        ]) => ({
            friends, followers, subscriptions,
            photos, photosLikes,
            posts, postsLikes
        })
    ).transparent(
        snapshot => console.rec({snapshot})
    );
}

export function saveSnapshot(snapshot) {
    return model.setSnapshot(snapshot);
}

function getFriendsLists() {
    return Promise.all([
        model.getFriends().then(response => response.items),
        model.getFollowers().then(response => response.items),
        model.getSubscriptions().then(response => response.items)
    ]).then(
        ([friends, followers, subscriptions]) => ({
            friends,
            followers,
            subscriptions
        })
    );
}

function getPhotosObject() {
    return getAlbums().then(getPhotos).then(
        photos => Promise.all([
            getPhotosLikes(photos),
            getPhotosList(photos)
        ])
    ).then(
        ([photosLikes, photos]) => ({
            photos,
            photosLikes
        })
    );

    function getAlbums() {
        return model.getAlbums().then(response => response.items);
    }

    function getPhotos(albums) {
        return Promise.all(
            albums.filter(album => album.size > 0).map(album => album.id).map(model.getPhotos)
        ).then(
            responses => concat(responses.map(response => response.items))
        );
    }
}

function getPhotosList(photos) {
    return photos.map(photo => photo.id);
}

function getPhotosLikes(photos) {
    let photosWithLikes = photos.filter(photo => photo.likes.count > 0).map(photo => photo.id);

    return Promise.all(photosWithLikes.map(getPhotoLikes));
}

function getPhotoLikes(photo) {
    return model.getPhotoLikes(photo).then(
        response => response.items
    ).then(
        likes => ({
            photo,
            likes
        })
    );
}

function getPostsObject() {
    return getPosts().then(
        posts => Promise.all([
            getPostsLikes(posts),
            getPostsList(posts)
        ])
    ).then(
        ([postsLikes, posts]) => ({
            posts,
            postsLikes
        })
    );

    function getPosts() {
        return model.getPosts().then(response => response.items);
    }
}

function getPostsList(posts) {
    return posts.map(post => post.id);
}

function getPostsLikes(posts) {
    let postsWithLikes = posts.filter(post => post.likes.count > 0).map(post => post.id);

    return Promise.all(
        postsWithLikes.map(getPostLikes)
    );
}

function getPostLikes(post) {
    return model.getPostLikes(post).then(
        response => response.items
    ).then(
        likes => ({
            post,
            likes
        })
    );
}
