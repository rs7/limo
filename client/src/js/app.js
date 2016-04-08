'use strict';

const $ = require('jquery');

import {saveSnapshot, getFeeds, getNewFeeds} from './lib/logic';
import {getLastSeen, setLastSeen} from './lib/model';

import {ObjectId} from './lib/util';

import * as fd from './feed';

import * as display from './display';

let newTo;

let nextPage;

$(window).load(init);

function init() {
    let lastSeen = getLastSeen();

    fd.setLastSeen(lastSeen);

    newTo = nextPage = lastSeen || ObjectId.now();

    display.feedNewUpdateHandler(updateNew);
    display.feedNewOpenHandler(openNew);
    display.feedPageNextHandler(showNextPage);

    showNextPage();
    updateNew();
}

//----------------------------------------

const FINISH_NEW = 1;
const FINISH_PAGE = 2;
const FINISH_ALL = 3;

let finished = 0;

function finish(value) {
    finished |= value;

    if (finished != FINISH_ALL) {
        return;
    }

    if (fd.isEmpty()) {
        display.feedEmpty();
    }
}

//----------------------------------------

function showError(error) {
    console.error('ошибка', error);
    display.showError(error);
}

//----------------------------------------

function updateNew() {
    showProgress();
    display.feedNewUpdateHide();

    return saveSnapshot().then(getNew).finally(hideProgress).then(({feeds}) => {
        setNew(feeds);

        if (fd.isOnlyNew()) {
            return openNew();
        }

        if (fd.isNewEmpty()) {
            display.feedNewEmpty();
        }
    }).then(() => {
        finish(FINISH_NEW);
    }).catch(error => {
        display.feedNewUpdateShow();
        showError(error);
    });

    function getNew() {
        return getNewFeeds({to: newTo});
    }

    function setNew(feeds) {
        set(feeds);
        saveTo();

        function set(feeds) {
            fd.setNewFeeds(feeds);
        }

        function saveTo() {
            newTo = fd.getLast();
        }
    }

    function showProgress() {
        display.feedNewProgress(0);
    }

    function hideProgress() {
        display.feedNewProgress(1);
    }
}

function openNew() {
    fd.showNewFeeds();

    return setLastSeen(fd.getLastSeen()).catch(showError);
}

//----------------------------------------

function showNextPage() {
    showProgress();

    return getFeeds({from: nextPage}).then(({feeds, next}) => {
        show(feeds, next);
        saveNext(next);
    }).finally(hideProgress).then(() => {
        finish(FINISH_PAGE);
    }).catch(showError);

    function saveNext(next) {
        nextPage = next;
    }

    function show(feeds, next) {
        fd.showPage(feeds, !next);
    }

    function showProgress() {
        display.feedPageProgress(0);
    }

    function hideProgress() {
        display.feedPageProgress(1);
    }
}
