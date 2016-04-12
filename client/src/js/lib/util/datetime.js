'use strict';

export function timestamp(date) {
    return Math.floor(date.getTime() / 1000);
}

export function currentTime() {
    return new Date().getTime();
}

export function currentTimestamp() {
    return timestamp(new Date());
}
