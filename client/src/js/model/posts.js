'use strict';

import {user} from './../params';

import * as model from './model';

import {complete} from './complete';
import {Cache} from './cache';

let cache = new Cache(getPostsWorker);

export function getPosts(posts) {
    return cache.get(posts);
}

function getPostsWorker(posts) {
    return model.getPostsByList(posts).then(results => complete(posts, results, deletedPost));
}

function deletedPost(post) {
    return {
        id: post,
        owner_id: user
    };
}
