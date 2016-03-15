'use strict';

const $ = require('jquery');

import {printDate} from './lib/util';
import {saveSnapshot, getHistory} from './lib/logic';

import {default as Template} from './templates';
import {initHelpers} from './lib/hbs';

import {updateFrameSize} from './lib/vk'

$(document).ready(init);

function init() {
    initHelpers();

    updateFrameSize();
    saveSnapshot().then(showNextPage);

    $('#show_more_link').click(showNextPage);
}

let page = 0;

function showNextPage() {
    $('#show_more').css('display', 'none');
    $('#show_more_progress').css('display', 'block');

    getHistory(page++).then(items => {
        $('#show_more_progress').css('display', 'none');

        if (items.length == 0) {
            $('#show_more_link').css('display', 'none');
            $('#all_shown').css('display', 'block');
        } else {
            showItems(items);
            $('#show_more').css('display', 'block');
        }

        updateFrameSize();
    });
}

function clearItems() {
    var unreadBar = $('#feedback_unread_bar');
    unreadBar.css('display', 'none');
    unreadBar.prevAll().remove();
    unreadBar.nextAll().remove();

    $('#feed_empty').css('display', 'block');
}

function showItems(items) {
    let lastSeen = new Date(0); //todo: временное решение для отладки окружающего кода

    items.sort((a, b) => b.date - a.date);

    if (items.length > 0) {
        $('#feed_empty').css('display', 'none');
    }

    let unreadItems = items.filter(item => item.date >= lastSeen);

    let readItems = items.filter(item => item.date < lastSeen);

    var unreadBar = $('#feedback_unread_bar');

    if (unreadItems.length > 0 && readItems.length > 0) {
        unreadBar.css('display', 'block');
    }

    unreadItems.forEach(function (item) {
        unreadBar.before(Template(item));
    });

    readItems.forEach(function (item) {
        unreadBar.after(Template(item));
    });
}
