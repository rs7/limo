'use strict';

const $ = require('jquery');

import {saveSnapshot, getFeeds, getNewFeeds} from './lib/logic';
import {getLastSeen, setLastSeen} from './lib/model';

import * as fd from './feed';
import * as display from './display';

$(window).load(init);

function init() {
    fd.setLastSeen(getLastSeen());

    display.feedNewUpdateHandler(updateNew);
    display.feedNewOpenHandler(openNew);
    display.feedPageNextHandler(showNextPage);

    Promise.all([
        showNextPage(),
        updateNew()
    ]).then(() => {
        display.feedEmptyVisible(fd.isEmpty());
    });
}

//----------------------------------------

function errorHandler(error) {
    display.showError(error);
    console.error(error);
    throw error;
}

//----------------------------------------

function updateNew() {
    display.feedNewUpdateVisible(false);
    display.feedNewProgressVisible(true);

    return saveSnapshot().then(() => {
        return getNewFeeds({to: fd.getPrev()});
    }).finally(() => {
        display.feedNewProgressVisible(false);
    }).then(({feeds}) => {
        fd.addPrev(feeds);
        display.feedNewOpenCount(fd.countPrev());
        display.feedNewOpenVisible(fd.countPrev());
        display.feedNewEmptyVisible(!fd.countPrev());

        if (fd.isOnlyPrev()) {
            return openNew();
        }
    }).catch(error => {
        display.feedNewUpdateVisible(true);
        throw error;
    }).catch(errorHandler);
}

function openNew() {
    display.feedAddPrev(fd.flushPrev());
    display.feedUnread(fd.findLastRead());
    display.feedNewOpenCount(fd.countPrev());
    display.feedNewOpenVisible(fd.countPrev());
    return setLastSeen(fd.getLastSeen()).catch(errorHandler);
}

//----------------------------------------

function showNextPage() {
    display.feedPageNextVisible(false);
    display.feedPageProgressVisible(true);
    return getFeeds({from: fd.getNext()}).finally(() => {
        display.feedPageProgressVisible(false);
    }).then(({feeds, next}) => {
        fd.setNext(next);
        fd.addNext(feeds);
        display.feedAddNext(fd.flushNext());
        display.feedUnread(fd.findLastRead());
        display.feedPageNextVisible(fd.getNext());
        display.feedAllShownVisible(!fd.getNext() && !fd.isEmpty());
    }).catch(error => {
        display.feedPageNextVisible(true);
        throw error;
    }).catch(errorHandler);
}
