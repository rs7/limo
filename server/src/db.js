'use strict';

const isProduction = process.env.NODE_ENV == 'production';

export let mongoose = require('mongoose');

export let ObjectId = mongoose.Types.ObjectId;

export function objectId(value) {
    return validateObjectId(value) && new ObjectId(value);
}

function validateObjectId(id) {
    return /^[0-9a-fA-F]{24}$/.test(id);
}

export function renameId(object) {
    let result = Object.assign({}, object);
    result.id = result._id;
    delete result._id;
    return result;
}

mongoose.set('debug', !isProduction);

mongoose.connect('mongodb://localhost/limo', {config: {autoIndex: true}});

let photosLikesSchema = mongoose.Schema({
    photo: {type: Number, required: true},
    likes: [Number]
}, {
    strict: 'throw',
    _id: false
});

let postsLikesSchema = mongoose.Schema({
    post: {type: Number, required: true},
    likes: [Number]
}, {
    strict: 'throw',
    _id: false
});

let snapshotSchema = mongoose.Schema({
    date: {type: Date, required: true},
    friends: [Number],
    followers: [Number],
    subscriptions: [Number],
    photos: [Number],
    photosLikes: [photosLikesSchema],
    posts: [Number],
    postsLikes: [postsLikesSchema]
}, {
    strict: 'throw',
    _id: false
});

let feedSchema = mongoose.Schema({
    type: {type: String, required: true, enum: ['unfriend', 'unfollow', 'unlike_photo', 'unlike_post']},
    owner: {type: Number, required: true},
    user: {type: Number, required: true},
    period: {
        from: {type: Date, required: true},
        to: {type: Date, required: true}
    },
    photo: {type: Number, required: false}, //только для типа 'unlike_photo'
    post: {type: Number, required: false} //только для типа 'unlike_post'
}, {
    strict: 'throw'
});

feedSchema.index({owner:1, _id: 1});

export let Feed = mongoose.model('Feed', feedSchema);

let userSchema = mongoose.Schema({
    id: {type: Number, required: true},
    snapshot: {type: snapshotSchema, required: true}
}, {
    strict: 'throw',
    id: false
});

userSchema.index({id: 1}, {unique: true});

export let User = mongoose.model('User', userSchema);

let recSchema = mongoose.Schema({
    user: {type: Number, required: true},
    date: {type: Date, required: true},
    rows: []
}, {
    strict: 'throw',
    id: false
});

export let Rec = mongoose.model('Rec', recSchema);

let subscriptionSchema = mongoose.Schema({
    user: {type: Number, required: true},
    activation: {type: Date, required: true},
    expires: {type: Date, required: true},
    basis: {}
}, {
    strict: 'throw',
    id: false
});

export let Subscription = mongoose.model('Rec', recSchema);
