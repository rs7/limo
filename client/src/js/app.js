'use strict';

const $ = require('jquery');

import {saveSnapshot, getFeeds} from './lib/logic';
import * as display from './display';
import {ObjectId} from './lib/util';
import {getLastSeen, setLastSeen} from './lib/model';

$(document).ready(init);

function init() {
    saveSnapshot().then(showNextPage).catch(error => {
        console.log('ОШИБКА', error);
    });

    display.showMoreClick(showNextPage);

    let lastSeenValue = getLastSeen();
    lastSeen = lastSeenValue && new ObjectId(lastSeenValue);
}

let lastSeen;

let feedsCollection = {
    feeds: [],
    get last() {
        return this.feeds.last();
    },
    get first() {
        return this.feeds.first();
    },
    fromValue() {
        if (this.feeds.isEmpty()) {
            return undefined;
        }
        return this.last.id;
    },
    add(feeds) {
        this.feeds.pushAll(feeds);
    },
    isWithin(id) {
        if (this.feeds.isEmpty()) {
            return false;
        }

        return ObjectId.compare(this.feeds.first().id, id) > 0 && ObjectId.compare(this.feeds.last().id, id) < 0;
    },
    findLast(id) {
        return this.feeds.find(feed => ObjectId.compare(feed.id, id) <= 0 );
    }
};

let firstPageLoaded = false;

function showNextPage() {
    display.feedLoading(true);

    return getFeeds(feedsCollection.fromValue()).then(feeds => {
        display.feedLoading(false);

        if (feeds.isEmpty()) {
            display.allShowed();
            return;
        }

        feedsCollection.add(feeds);

        display.addFeeds(feeds);

        if (!firstPageLoaded) {
            display.hideFeedsEmpty();
            setLastSeen(feedsCollection.first.id);
            firstPageLoaded = true;
        }

        if (feedsCollection.isWithin(lastSeen)) {
            display.unreadBarBefore(feedsCollection.findLast(lastSeen).id);
        }

        display.updateFrameSize();
    });
}
