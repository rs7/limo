'use strict';

let isArray = value => Array.isArray(value);

let isAuthKey = value => /^[0-9a-f]{32}$/.test(value);
let isUser = value => /^[1-9]\d*$/.test(value);

let isFrom = value => /^[0-9a-f]{24}$/.test(value);

let isUsers = value => isArray(value) && value.every(isUser);
let isPhoto = value => /^[1-9]\d*$/.test(value);
let isPhotos = value => isArray(value) && value.every(isPhoto);
let isLike = value => isPhoto(value.photo) && isUsers(value.likes);
let isLikes = value => isArray(value) && value.every(isLike);
let isSnapshot = value => isPhotos(value.photos) && isLikes(value.likes);

export let validators = {
    isAuthKey,
    isUser,
    isFrom,
    isSnapshot
};
