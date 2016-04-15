'use strict';

const $ = require('jquery');

import {saveSnapshot, getFeeds, getNewFeeds} from './logic';
import {getLastSeen, setLastSeen} from './model/model';

import * as fd from './model/feed';
import * as display from './display/display';

$(window).load(init);

function init() {
    console.rec({load: 1});

    fd.setLastSeen(getLastSeen());

    display.feedNewUpdateHandler(updateNew);
    display.feedNewOpenHandler(openNew);
    display.feedPageNextHandler(showNextPage);

    Promise.all([
        showNextPage(),
        updateNew()
    ]).then(() => {
        console.rec({empty: 1});

        display.feedEmptyVisible(fd.isEmpty());
    });
}

//----------------------------------------

function errorHandler(error) {
    console.rec({error});
    console.sendRec();

    display.showError(error);
    console.error(error);
}

//----------------------------------------

function updateNew() {
    console.rec({updateNew: 1});

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
    console.rec({openNew: 1});

    display.feedAddPrev(fd.flushPrev());
    display.feedUnread(fd.findLastRead());
    display.feedNewOpenCount(fd.countPrev());
    display.feedNewOpenVisible(fd.countPrev());
    display.feedAllShownVisible(!fd.getNext() && !fd.isEmpty());
    return setLastSeen(fd.getLastSeen()).catch(errorHandler);
}

//----------------------------------------

function showNextPage() {
    console.rec({showNextPage: 1});

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
