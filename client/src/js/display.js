'use strict';

const $ = require('jquery');

const templates = require('./templates');

import {initHelpers} from './lib/hbs';
import {frameHeight} from './lib/vk_sdk';

$(document).ready(initHelpers);

$(window).load(updateFrameSize);

function updateFrameSize() {
    frameHeight($('body').outerHeight());
}

//----------------------------------------

export function showError(error) {
    $('#feed_errors').append(templates['error'](error));

    updateFrameSize();
}

//----------------------------------------

export function feedPageAll() {
    $('#show_more_link').css('display', 'none');
    $('#all_shown').css('display', 'block');

    updateFrameSize();
}

export function feedPageNextHandler(handler) {
    $('#show_more_link').click(handler);
}

export function feedPageProgress(progress) {
    if (progress == 1) {
        $('#show_more_progress').css('display', 'none');
        $('#show_more').css('display', 'block');
    } else {
        $('#show_more').css('display', 'none');
        $('#show_more_progress').css('display', 'block');
    }

    updateFrameSize();
}

//----------------------------------------

export function feedNewCount(count) {
    let feedNewPosts = $('#feed_new_posts');

    if (count) {
        feedNewPosts.css('display', 'block');
    } else {
        feedNewPosts.css('display', 'none');
    }

    feedNewPosts.html(templates['feed_new_posts']({count}));

    updateFrameSize();
}

export function feedNewEmpty() {
    $('#feed_new_empty').css('display', 'block');

    updateFrameSize();
}

export function feedNewOpenHandler(handler) {
    $('#feed_new_posts').click(handler);
}

export function feedNewProgress(progress) {
    if (progress == 1) {
        $('#feed_new_progress').css('display', 'none');
    } else {
        $('#feed_new_progress').css('display', 'block');
    }

    updateFrameSize();
}

export function feedNewUpdateHandler(handler) {
    $('#feed_new_update').click(handler);
}

export function feedNewUpdateHide() {
    $('#feed_new_update').css('display', 'none');

    updateFrameSize();
}

export function feedNewUpdateShow() {
    $('#feed_new_update').css('display', 'block');

    updateFrameSize();
}

//----------------------------------------

export function feedAdd(feed, {after, before}) {
    let feedElement = templates[`feed_${feed.type}`](feed);

    if (after) {
        $(`#feed_row_${after.value}`).after(feedElement);
    } else if (before) {
        $(`#feed_row_${before.value}`).before(feedElement);
    } else {
        $('#feed_rows').append(feedElement);
    }

    updateFrameSize();
}

export function feedEmpty() {
    $('#feed_empty').css('display', 'block');

    updateFrameSize();
}

export function feedUnread(before) {
    let unreadBar = $('#feedback_unread_bar');

    unreadBar.detach().insertBefore($(`#feed_row_${before.value}`));
    unreadBar.css('display', 'block');

    updateFrameSize();
}
