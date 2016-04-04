'use strict';

const $ = require('jquery');

const templates = require('./templates');

import {initHelpers} from './lib/hbs';
import {frameHeight} from './lib/vk_sdk';

$(window).load(init);

function init() {
    initHelpers();
    updateFrameSize();
}

export function updateFrameSize() {
    frameHeight($('body').outerHeight());
}

export function showMoreClick(handler) {
    $('#show_more_link').click(handler);
}

export function addFeed(feed, {after, before}) {
    if (after) {
        $(`#feed_row_${after.value}`).after(createFeed(feed));
        return;
    }

    if (before) {
        $(`#feed_row_${before.value}`).before(createFeed(feed));
        return;
    }

    $('#feed_rows').append(createFeed(feed));
}

function createFeed(feed) {
    return templates[`feed_${feed.type}`](feed);
}

export function hideFeedsEmpty() {
    $('#feed_empty').css('display', 'none');
}

export function allShowed() {
    $('#show_more_link').css('display', 'none');
    $('#all_shown').css('display', 'block');
}

export function feedLoading(value) {
    if (value) {
        $('#show_more').css('display', 'none');
        $('#show_more_progress').css('display', 'block');
    } else {
        $('#show_more_progress').css('display', 'none');
        $('#show_more').css('display', 'block');
    }
}

export function showMoreLink() {
    $('#show_more_link').css('display', 'block');
    updateFrameSize();
}

export function showEmpty() {
    $('#feed_empty').css('display', 'block');
    updateFrameSize();
}

export function snapshotProgress(value) {
    if (value == 1) {
        $('#feed_new').css('display', 'none');
    } else {
        $('#feed_new').css('display', 'block');
    }
    updateFrameSize();
}

export function unreadBarBefore(id) {
    let unreadBar = $('#feedback_unread_bar');

    if (!id) {
        unreadBar.css('display', 'none');
        return;
    }

    unreadBar.detach().insertBefore($(`#feed_row_${id.value}`));
    unreadBar.css('display', 'block');
}
