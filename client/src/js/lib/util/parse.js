'use strict';

import {ObjectId} from './../util';

export function parseObjectId(value) {
    return ObjectId.validate(value)? new ObjectId(value) : undefined;
}

export function parseDate(date) {
    return new Date(date);
}
