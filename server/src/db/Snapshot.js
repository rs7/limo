'use strict';

const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let PhotosLikesSchema = new Schema({
    photo: {type: Number, required: true},
    likes: [Number]
}, {
    strict: 'throw',
    _id: false
});

let PostsLikesSchema = new Schema({
    post: {type: Number, required: true},
    likes: [Number]
}, {
    strict: 'throw',
    _id: false
});

export let SnapshotSchema = new Schema({
    date: {type: Date, required: true},
    friends: [Number],
    followers: [Number],
    subscriptions: [Number],
    photos: [Number],
    photosLikes: [PhotosLikesSchema],
    posts: [Number],
    postsLikes: [PostsLikesSchema]
}, {
    strict: 'throw',
    _id: false
});
