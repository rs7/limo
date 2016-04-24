'use strict';

const mongoose = require('mongoose');
const extend = require('mongoose-schema-extend');

let Schema = mongoose.Schema;

let FeedSchema = new Schema({
    owner: {type: Number, required: true}
}, {
    collection: 'feeds',
    discriminatorKey : 'type',
    strict: 'throw'
});

let ChangeFeedSchema = FeedSchema.extend({
    user: {type: Number, required: true},
    period: {
        from: {type: Date, required: true},
        to: {type: Date, required: true}
    }
});

let UnlikePhotoFeedSchema = ChangeFeedSchema.extend({
    photo: {type: Number, required: true}
});

let UnlikePostFeedSchema = ChangeFeedSchema.extend({
    post: {type: Number, required: true}
});

let InfoFeedSchema = FeedSchema.extend({
    date: {type: Date, required: true},
    message: {
        key: {type: String, required: true},
        data: {}
    }
});

FeedSchema.index({owner: 1, _id: 1});

export let Feed = mongoose.model('Feed', FeedSchema);

export let UnfriendFeed = mongoose.model('unfriend', ChangeFeedSchema);
export let UnfollowFeed = mongoose.model('unfollow', ChangeFeedSchema);
export let UnlikePhotoFeed = mongoose.model('unlike_photo', UnlikePhotoFeedSchema);
export let UnlikePostFeed = mongoose.model('unlike_post', UnlikePostFeedSchema);
export let InfoFeed = mongoose.model('info', InfoFeedSchema);
