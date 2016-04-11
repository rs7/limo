'use strict';

const async = require('async-q');

import {uniqueFilter, auto, processArray, parseObjectId} from './util';

import * as model from './model';

export function saveSnapshot() {
    return auto({
        friends: () => model.getFriends().then(response => response.items),
        subscriptions: () => model.getSubscriptions().then(response => response.items),
        followers: () => model.getFollowers().then(response => response.items),

        albums: () => model.getAlbums().then(response => response.items),
        photos: ['albums', ({albums}) => async.map(
            albums.filter(album => album.size > 0).map(album => album.id),
            model.getPhotos
        ).then(responses => Array.prototype.concat.apply([], responses.map(response => response.items)))],
        photosList: ['photos', ({photos}) => photos.map(photo => photo.id)],
        photosWithLikes: ['photos', ({photos}) => photos.filter(photo => photo.likes.count > 0).map(photo => photo.id)],
        photosLikes: ['photosWithLikes', ({photosWithLikes}) => async.map(photosWithLikes, model.getPhotoLikes)],

        posts: () => model.getPosts().then(response => response.items),
        postsList: ['posts', ({posts}) => posts.map(post => post.id)],
        postWithLikes: ['posts', ({posts}) => posts.filter(post => post.likes.count > 0).map(post => post.id)],
        postsLikes: ['postWithLikes', ({postWithLikes}) => async.map(postWithLikes, model.getPostLikes)],

        snapshot: [
            'friends', 'subscriptions', 'followers',
            'photosList', 'photosWithLikes', 'photosLikes',
            'postsList', 'postWithLikes', 'postsLikes',
            ({
                friends, subscriptions, followers,
                photosList, photosWithLikes, photosLikes,
                postsList, postWithLikes, postsLikes
            }) => ({
                friends,
                subscriptions,
                followers,

                photos: photosList,
                photosLikes: photosWithLikes.map((photo, index) => ({
                    photo,
                    likes: photosLikes[index].items
                })),

                posts: postsList,
                postsLikes: postWithLikes.map((post, index) => ({
                    post,
                    likes: postsLikes[index].items
                }))
            })
        ],

        result: ['snapshot', ({snapshot}) => model.setSnapshot(snapshot)]
    }, {
        log: 1
    });
}

export function getFeeds({from}) {
    return auto({
        response: () => model.getFeeds({from}),

        feeds: ['response', ({response}) => fillFeeds(response.feeds)],

        next: ['response', ({response}) => response.next],

        result: ['feeds', 'next', ({feeds, next}) => ({feeds, next})]
    });
}

export function getNewFeeds({to}) {
    return auto({
        response: () => model.getNewFeeds({to}),

        feeds: ['response', ({response}) => fillFeeds(response.feeds)],

        result: ['feeds', ({feeds}) => ({feeds})]
    });
}

function fillFeeds(feeds) {
    return auto({
        feeds: () => feeds,

        photos: ['feeds', ({feeds}) => {
            let photos = feeds.filter(feed => feed.photo).map(like => like.photo).filter(uniqueFilter);

            return model.getPhotosByList(photos).then(photos => mapById(photos));
        }],

        users: ['feeds', ({feeds}) => {
            let users = feeds.filter(feed => feed.user).map(like => like.user).filter(uniqueFilter);

            return model.getUsers(users).then(users => mapById(users));
        }],

        posts: ['feeds', ({feeds}) => {
            let posts = feeds.filter(feed => feed.post).map(like => like.post).filter(uniqueFilter);

            return model.getPostsByList(posts).then(posts => mapById(posts));
        }],

        result: ['feeds', 'photos', 'users', 'posts', ({feeds, photos, users, posts}) =>
            processArray(feeds, {
                user: user => users.get(user),
                photo: photo => photos.get(photo),
                post: post => posts.get(post)
            })
        ]
    });
}

function mapById(array) {
    return new Map(array.map(item => [item.id, item]));
}
