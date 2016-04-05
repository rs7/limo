'use strict';

const $ = require('jquery');

import {saveSnapshot, getFeeds, getNewFeeds} from './lib/logic';
import {getLastSeen, setLastSeen} from './lib/model';

import * as fd from './feed';

import * as display from './display';

let lastSeen;

let nextPage;

$(document).ready(init);

function init() {
    nextPage = lastSeen = getLastSeen();

    fd.setLastSeen(lastSeen);

    start();
}

function start() {
    Promise.all([
        showNextPage(),
        doSnapshot()
    ]).then(
        checkNew
    ).then(
        finish
    );

    display.feedPageNextHandler(showNextPage);
    display.feedNewOpenHandler(openNew);
}

function finish() {
    if (fd.isEmpty()) {
        display.feedEmpty();
        return;
    }

    if (fd.isOnlyNew()) {
        openNew();
    }
}

function showNextPage() {
    display.feedPageProgress(0);

    return getFeeds({from: nextPage}).then(({feeds, next}) => {
        display.feedPageProgress(1);

        nextPage = next;

        fd.showPage(feeds, !nextPage);
    });
}

function checkNew() {
    display.feedNewProgress(0);

    let to = fd.getLastSeen() || lastSeen;

    return getNewFeeds({to}).then(({feeds}) => {
        display.feedNewProgress(1);

        fd.setNewFeeds(feeds);
    });
}

function openNew() {
    fd.showNewFeeds();

    setLastSeen(fd.getLastSeen());
}
function doSnapshot() {
    display.feedNewProgress(0);

    return saveSnapshot().then(() => display.feedNewProgress(1));
}

