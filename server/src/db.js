'use strict';

let mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/limo');

//schema

let likesSchema = mongoose.Schema({
    photo: {type: Number, required: true},
    likes: {type: [Number], default: []}
}, {strict: true});

let snapshotSchema = mongoose.Schema({
    date: {type: Date, required: true},
    items: {type: [likesSchema], default: []}
});

let historySchema = mongoose.Schema({
    photo: {type: Number, required: true},
    user: {type: Number, required: true},
    date: {type: Date, default: Date.now},
    period: {
        from: {type: Date, required: true},
        to: {type: Date, required: true}
    }
}, {strict: true});

let userSchema = mongoose.Schema({
    id: {type: Number, required: true},
    snapshot: {type: snapshotSchema, required: true},
    last_seen: {type: Date, required: true},
    history: {type: [historySchema], default: []}
}, {strict: true});

export let User = mongoose.model('User', userSchema);
