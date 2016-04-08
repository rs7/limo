'use strict';

import {ObjectId, isBetween} from './lib/util';

import * as display from './display';

let feeds = [];
let feedsNew = [];

let lastSeen;

export function setLastSeen(value) {
    lastSeen = value;
}

export function getLast() {
    return firstWithNew();
}

export function getLastSeen() {
    return first();
}

export function isEmpty() {
    return feeds.isEmpty() && feedsNew.isEmpty();
}

export function isOnlyNew() {
    return feeds.isEmpty() && !feedsNew.isEmpty();
}

export function isNewEmpty() {
    return feedsNew.isEmpty();
}

function firstWithNew() {
    return feedsNew.last() && feedsNew.last().id || first();
}

function first() {
    return feeds.first() && feeds.first().id;
}

function last() {
    return feeds.last() && feeds.last().id;
}

function hasUnread() {
    if (feeds.isEmpty() || !lastSeen) {
        return false;
    }

    return isBetween(lastSeen, first(), last(), ObjectId.compare);
}

function findLastRead() {
    return feeds.find(feed => ObjectId.compare(feed.id, lastSeen) <= 0);
}

export function showNewFeeds() {
    feedsNew.forEach(feed => {
        display.feedAdd(feed, {before: first()});
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

export function showPage(feedsNew, isLastPage) {
    feedsNew.forEach(feed => {
        display.feedAdd(feed, {after: last()});
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
