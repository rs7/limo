'use strict';

let isAuthKey = value => /^[0-9a-f]{32}$/.test(value);

let isUser = value => /^[1-9]\d*$/.test(value);
let isPhoto = value => /^[1-9]\d*$/.test(value);
let isFeedId = value => /^[0-9a-f]{24}$/.test(value);

let isLike = value => isPhoto(value.photo) && isUsers(value.likes);

let isArray = value => Array.isArray(value);
let isUsers = value => isArray(value) && value.every(isUser);
let isPhotos = value => isArray(value) && value.every(isPhoto);
let isLikes = value => isArray(value) && value.every(isLike);

export let validators = {
    isAuthKey,
    isUser,
    isFeedId,
    isUsers,
    isPhotos,
    isLikes
};
