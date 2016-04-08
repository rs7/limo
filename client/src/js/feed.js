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
}

export function getLastSeen() {
    return id(feeds.first());
}

function setPrev(value) {
    prev = value;
}

export function getPrev() {
    return prev;
}

export function setNext(value) {
    next = value;
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
}

export function addNext(feedsNew) {
    feedsNext.pushAll(feedsNew);
}

//----------------------------------------

export function flushPrev() {
    let result = feedsPrev.slice();
    feeds.unshiftAll(feedsPrev);
    feedsPrev.clear();
    return result;
}

export function flushNext() {
    let result = feedsNext.slice();
    feeds.pushAll(feedsNext);
    feedsNext.clear();
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
