'use strict';

let isAuthKey = value => /^[0-9a-f]{32}$/.test(value);
let isUser = value => /^[1-9]\d*$/.test(value);

let isFrom = value => /^[0-9a-f]{24}$/.test(value);

let isArrayOfUsers = value => value.every(isUser);
let isPhoto = value => /^[1-9]\d*$/.test(value);
let isSnapshotItem = value => isPhoto(value.photo) && isArrayOfUsers(value.likes);
let isSnapshot = value => value.every(isSnapshotItem);

export let validators = {
    isAuthKey,
    isUser,
    isFrom,
    isSnapshot
};
