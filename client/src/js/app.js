'use strict';

const $ = require('jquery');

import {getSnapshot, saveSnapshot} from './controller/snapshot';
import {getFeedsTo, getFeedsFrom} from './controller/feeds';

import {getLastSeen, setLastSeen, getLastTime, setLastTime} from './model/model';

import {Timer, Duration} from './util/datetime';

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
        display.feedNewEmptyVisible(!fd.isEmpty());
    });
}

//----------------------------------------

function errorHandler(error) {
    console.rec({error});
    console.sendRec();

    display.showError(error);
    console.error(error);

    throw error;
}

//----------------------------------------

function updateNew() {
    console.rec({updateNew: 1});

    display.feedNewUpdateVisible(false);

    return snapshot().then(time => {
        console.rec({time});

        return Promise.all([
            setLastTime(time),
            checkNew()
        ]);
    }).catch(error => {
        display.feedNewUpdateVisible(true);
        throw error;
    }).catch(errorHandler);

    function checkNew() {
        display.feedNewProgressVisible(true);

        return getFeedsTo(fd.getPrev()).finally(
            () => display.feedNewProgressVisible(false)
        ).then(({feeds}) => {
            fd.addPrev(feeds);
            display.feedNewOpenCount(fd.countPrev());
            display.feedNewOpenVisible(fd.countPrev());
            display.feedNewEmptyVisible(!fd.countPrev());

            if (fd.isOnlyPrev()) {
                return openNew();
            }
        });
    }

    function snapshot() {
        let timer = new Timer(-getLastTime(), Infinity, 1000);
        timer.start(time => display.feedNewSnapshotProgressTimerUpdate(time));

        display.feedNewSnapshotProgressVisible(true);

        let duration = new Duration();
        duration.start();

        return getSnapshot().then(saveSnapshot).then(
            () => {
                duration.stop();
                return duration.get();
            }
        ).finally(
            () => {
                timer.stop();
                display.feedNewSnapshotProgressVisible(false);
            }
        );
    }
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
    return getFeedsFrom(fd.getNext()).finally(() => {
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
