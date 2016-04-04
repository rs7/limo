'use strict';

const $ = require('jquery');

import {ObjectId, isBetween} from './lib/util';
import {saveSnapshot, getFeeds, getNewFeeds} from './lib/logic';
import {getLastSeen, setLastSeen} from './lib/model';

import * as display from './display';

$(document).ready(init);

function init() {
    nextPage = lastSeen = getLastSeen();

    Promise.all([
        showNextPage(),
        snapshot()
    ]).then(checkNew).then(() => {
        if (feedsCollection.feeds.isEmpty()) {
            display.showEmpty();
            return;
        }

        display.showMoreClick(showNextPage);
    });
}

let lastSeen;

let feedsCollection = {
    feeds: [],
    get lastId() {
        return this.feeds.last() && this.feeds.last().id;
    },
    get firstId() {
        return this.feeds.first() && this.feeds.first().id;
    },
    add(feeds) {
        this.feeds.pushAll(feeds);
        this.feeds.sort((a, b) => ObjectId.compare(a.id, b.id));
    },
    isWithin(id) {
        if (this.feeds.isEmpty()) {
            return false;
        }

        return isBetween(id, this.firstId, this.lastId, ObjectId.compare);
    },
    findLast(id) {
        return this.feeds.find(feed => ObjectId.compare(feed.id, id) <= 0);
    }
};

let nextPage;

function showNextPage() {
    display.feedLoading(true);

    let from = nextPage;

    return getFeeds({from}).then(({feeds, next}) => {
        display.feedLoading(false);

        nextPage = next;

        if (next) {
            nextPage = next;
            display.showMoreLink();
        } else {
            display.allShowed();
        }

        if (feeds.isEmpty()) {
            return;
        }

        feeds.forEach(feed => {
            display.addFeed(feed, {after: feedsCollection.lastId});
            feedsCollection.feeds.push(feed);
        });

        update();
    });
}

function checkNew() {
    let to = feedsCollection.firstId || lastSeen;

    return getNewFeeds({to}).then(({feeds}) => {
        if (feeds.isEmpty()) {
            return;
        }

        feeds.forEach(feed => {
            display.addFeed(feed, {before: feedsCollection.firstId});
            feedsCollection.feeds.unshift(feed);
        });

        setLastSeen(feedsCollection.firstId);

        update();
    });
}

function snapshot() {
    display.snapshotProgress(0);

    let promise = saveSnapshot();

    promise.then(() => {
        display.snapshotProgress(1);
    });

    return promise;
}

function update() {
    if (feedsCollection.isWithin(lastSeen)) {
        display.unreadBarBefore(feedsCollection.findLast(lastSeen).id);
    }

    display.updateFrameSize();
}
