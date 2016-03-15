'use strict';

const $ = require('jquery');

const FeedRowTemplate = require('./templates');

import {initHelpers} from './lib/hbs';
import {resizeFrame} from './lib/vk';

$(window).load(init);

function init() {
    initHelpers();
    updateFrameSize();
}

export function updateFrameSize() {
    resizeFrame($('body').outerHeight());
}

export function showMoreClick(handler) {
    $('#show_more_link').click(handler);
}

export function addFeeds(feeds) {
    let feedRows = $('#feed_rows');

    feeds.forEach(feed => {
        feedRows.append(FeedRowTemplate(feed));
    });
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

export function unreadBarBefore(id) {
    let unreadBar = $('#feedback_unread_bar');

    if (!id) {
        unreadBar.css('display', 'none');
        return;
    }

    unreadBar.detach().insertBefore($(`#feed_row_${id.value}`));
    unreadBar.css('display', 'block');
}
