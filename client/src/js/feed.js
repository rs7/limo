'use strict';

import {ObjectId, isBetween} from './lib/util';

let feeds = [];

let feedsPrev = [];
let feedsNext = [];

let lastSeen;

let prev;
let next;

//----------------------------------------

export function setLastSeen(value) {
    lastSeen = value;

    prev = lastSeen || ObjectId.now();
    next = lastSeen || ObjectId.now();

    console.rec({lastSeen, prev, next});
}

export function getLastSeen() {
    let value = id(feeds.first());

    console.rec({getLastSeen: value});

    return value;
}

function setPrev(value) {
    prev = value;

    console.rec({setPrev: value});
}

export function getPrev() {
    return prev;
}

export function setNext(value) {
    next = value;

    console.rec({setNext: value});
}

export function getNext() {
    return next;
}

//----------------------------------------

function id(feed) {
    return feed && feed.id;
}

//----------------------------------------

export function addPrev(feedsNew) {
    feedsPrev.pushAll(feedsNew);
    setPrev(id(feedsPrev.last()));

    console.rec({addPrev: feedsNew});
}

export function addNext(feedsNew) {
    feedsNext.pushAll(feedsNew);

    console.rec({addNext: feedsNew});
}

//----------------------------------------

export function flushPrev() {
    let result = feedsPrev.slice();
    feeds.unshiftAll(feedsPrev);
    feedsPrev.clear();

    console.rec({flushPrev: result});

    return result;
}

export function flushNext() {
    let result = feedsNext.slice();
    feeds.pushAll(feedsNext);
    feedsNext.clear();

    console.rec({flushNext: result});

    return result;
}

//----------------------------------------

export function countPrev() {
    return feedsPrev.length;
}

export function findLastRead() {
    if (feeds.isEmpty() || !lastSeen) {
        return;
    }

    if(!isBetween(lastSeen, id(feeds.first()), id(feeds.last()), ObjectId.compare)) {
        return;
    }

    return id(feeds.find(feed => ObjectId.compare(feed.id, lastSeen) <= 0));
}

//----------------------------------------

export function isOnlyPrev() {
    return !feedsPrev.isEmpty() && feeds.isEmpty() && feedsNext.isEmpty();
}

export function isEmpty() {
    return feedsPrev.isEmpty() && feeds.isEmpty() && feedsNext.isEmpty();
}
