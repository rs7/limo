'use strict';

import {ObjectId} from './../util/objectId';

export function parseObjectId(value) {
    return ObjectId.validate(value)? new ObjectId(value) : undefined;
}

export function parseDate(date) {
    return new Date(date);
}
