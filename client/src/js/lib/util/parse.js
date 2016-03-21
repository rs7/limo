'use strict';

import {ObjectId} from '../util';

export function parseObjectId(value) {
    return new ObjectId(value);
}

export function parseDate(date) {
    return new Date(date);
}
