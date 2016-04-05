'use strict';

import {ObjectId, isBetween} from './lib/util';

import * as display from './display';

let feeds = [];
let feedsNew = [];

let lastSeen;

export function setLastSeen(value) {
    lastSeen = value;
}

export function getLastSeen() {
    return firstId();
}

export function isEmpty() {
    return feeds.isEmpty() && feedsNew.isEmpty();
}

export function isOnlyNew() {
    return feeds.isEmpty() && !feedsNew.isEmpty();
}

function firstId() {
    return feeds.first() && feeds.first().id;
}

function lastId() {
    return feeds.last() && feeds.last().id;
}

function hasUnread() {
    if (feeds.isEmpty() || !lastSeen) {
        return false;
    }

    return isBetween(lastSeen, firstId(), lastId(), ObjectId.compare);
}

function findLastRead() {
    return feeds.find(feed => ObjectId.compare(feed.id, lastSeen) <= 0);
}

export function showNewFeeds() {
    feedsNew.forEach(feed => {
        display.feedAdd(feed, {before: firstId()});
        feeds.unshift(feed);
    });

    feedsNew.length = 0;

    display.feedNewCount(0);

    showUnreadBar();
}

function showUnreadBar() {
    if (hasUnread()) {
        display.feedUnread(findLastRead().id);
    }
}

export function showPage(newFeeds, isLastPage) {
    newFeeds.forEach(feed => {
        display.feedAdd(feed, {after: lastId()});
        feeds.push(feed);
    });

    if (isLastPage) {
        display.feedPageAll();
    }

    showUnreadBar();
}

export function setNewFeeds(feeds) {
    feedsNew = feeds;
    display.feedNewCount(feeds.length);
}
