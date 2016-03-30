'use strict';

export let mongoose = require('mongoose');

export let ObjectId = mongoose.Types.ObjectId;

export function objectId(value) {
    return validateObjectId(value) && new ObjectId(value);
}

function validateObjectId(id) {
    return /^[0-9a-fA-F]{24}$/.test(id);
}

mongoose.connect('mongodb://localhost/limo');

let likesSchema = mongoose.Schema({
    photo: {type: Number, required: true},
    likes: [Number]
}, {
    strict: 'throw',
    _id: false
});

let snapshotSchema = mongoose.Schema({
    date: {type: Date, required: true},
    photos: [Number],
    likes: [likesSchema]
}, {
    strict: 'throw',
    _id: false
});

let feedSchema = mongoose.Schema({
    owner: {type: Number, required: true},
    photo: {type: Number, required: true},
    user: {type: Number, required: true},
    period: {
        from: {type: Date, required: true},
        to: {type: Date, required: true}
    }
}, {
    strict: 'throw'
});

export let Feed = mongoose.model('Feed', feedSchema);

let userSchema = mongoose.Schema({
    id: {type: Number, required: true},
    snapshot: {type: snapshotSchema, required: true}
}, {
    strict: 'throw',
    id: false
});

export let User = mongoose.model('User', userSchema);
