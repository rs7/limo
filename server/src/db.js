'use strict';

let mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/limo');

let likesSchema = mongoose.Schema({
    photo: {type: Number, required: true},
    likes: {type: [Number], default: []}
}, {strict: true, _id: false});

let snapshotSchema = mongoose.Schema({
    date: {type: Date, required: true},
    items: {type: [likesSchema], default: []}
}, {strict: true, _id: false});

let feedSchema = mongoose.Schema({
    photo: {type: Number, required: true},
    user: {type: Number, required: true},
    period: {
        from: {type: Date, required: true},
        to: {type: Date, required: true}
    }
}, {strict: true, _id: false});

let userSchema = mongoose.Schema({
    id: {type: Number, required: true},
    snapshot: {type: snapshotSchema, required: true},
    last_seen: {type: Date, required: true},
    feeds: {type: [feedSchema], default: []}
}, {strict: true, id: false});

export let User = mongoose.model('User', userSchema);
