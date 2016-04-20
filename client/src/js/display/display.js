'use strict';

const $ = require('jquery');

const templates = require('./../templates/templates');

import {initHelpers} from './../templates/helpers';
import {frameHeight} from './../vk/sdk';
import {parseTimer} from './../util/datetime';

$(document).ready(initHelpers);

$(window).load(updateFrameSize);

function visible(elem, value) {
    elem.css('display', value? 'block' : 'none');
}

function updateFrameSize() {
    frameHeight($('body').outerHeight());
}

//----------------------------------------

export function showError(error) {
    $('#feed_errors').append(templates['error'](error));

    updateFrameSize();
}

//----------------------------------------

export function feedPageNextHandler(handler) {
    $('#show_more_link').click(handler);
}

export function feedPageNextVisible(value) {
    feedPageNextVisibleUpdate(FPVS.NEXT, value);
}

export function feedPageProgressVisible(value) {
    feedPageNextVisibleUpdate(FPVS.PROGRESS, value);
}

const FPVS = {
    state: 0,
    NEXT: 1,
    PROGRESS: 2
};

function feedPageNextVisibleUpdate(state, value) {
    if (value) {
        FPVS.state |= state;
    } else {
        FPVS.state &= ~state;
    }

    visible($('#show_more_link'), FPVS.state);

    visible($('#show_more'), FPVS.state & FPVS.NEXT);
    visible($('#show_more_progress'), FPVS.state & FPVS.PROGRESS);

    updateFrameSize();
}

//----------------------------------------

export function feedNewEmptyVisible(value) {
    visible($('#feed_new_empty'), value);

    updateFrameSize();
}

export function feedNewOpenCount(count) {
    $('#feed_new_posts').html(templates['feed_new_posts']({count}));
}

export function feedNewOpenHandler(handler) {
    $('#feed_new_posts').click(handler);
}

export function feedNewOpenVisible(value) {
    visible($('#feed_new_posts'), value);

    updateFrameSize();
}

export function feedNewProgressVisible(value) {
    visible($('#feed_new_progress'), value);

    updateFrameSize();
}

export function feedNewSnapshotProgressTimerUpdate(time) {
    let {sign, minutes, seconds} = parseTimer(time);
    let timer = $('#feed_new_snapshot_progress').find('.timer');
    timer.find('.sign').text(sign);
    timer.find('.minutes').text(minutes);
    timer.find('.seconds').text(seconds);
}

export function feedNewSnapshotProgressVisible(value) {
    visible($('#feed_new_snapshot_progress'), value);

    updateFrameSize();
}

export function feedNewUpdateHandler(handler) {
    $('#feed_new_update').click(handler);
}

export function feedNewUpdateVisible(value) {
    visible($('#feed_new_update'), value);

    updateFrameSize();
}

//----------------------------------------

function createFeedElement(feed) {
    return templates[`feed_${feed.type}`](feed);
}

function createFeedList(feeds) {
    return feeds.map(createFeedElement).join('\n');
}

export function feedAddPrev(feeds) {
    $('#feed_rows').prepend(createFeedList(feeds.reverse()));

    updateFrameSize();
}

export function feedAddNext(feeds) {
    $('#feed_rows').append(createFeedList(feeds));

    updateFrameSize();
}

export function feedAllShownVisible(value) {
    visible($('#all_shown'), value);

    updateFrameSize();
}

export function feedEmptyVisible(value) {
    visible($('#feed_empty'), value);

    updateFrameSize();
}

export function feedUnread(before) {
    let unreadBar = $('#feedback_unread_bar');

    visible(unreadBar, before);

    if (before) {
        unreadBar.detach().insertBefore($(`#feed_row_${before.value}`));
    }

    updateFrameSize();
}
