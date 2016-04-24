'use strict';

const isProduction = process.env.NODE_ENV == 'production';

import {db} from './config';

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

mongoose.connect(db.uri, {
    user: db.user,
    pass: db.pass,
    config: {autoIndex: true}
});
