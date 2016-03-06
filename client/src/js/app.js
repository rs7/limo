'use strict';

import $ from 'jquery';

import {printDate} from './lib/util';
import {saveSnapshot, getHistory} from './lib/logic';

import {default as Template} from './templates';
import {initHelpers} from './lib/hbs';

$(document).ready(init);

function init() {
    $('#get_history').click(showHistory);
    $('#set_snapshot').click(saveSnapshot);

    initHelpers();

    $('#page_wrap').load('page.html', () => {
        saveSnapshot().then(showHistory);
    });
}

function showHistory() {
    showLoading();
    clearItems();
    getHistory().then(response => {
        showItems(response);
        hideLoading();
    });
}

function showLoading() {
    $('#feed_new_posts').css('display', 'none');
    $('#feed_progress').css('display', 'block');
}

function hideLoading() {
    $('#feed_progress').css('display', 'none');
    $('#feed_new_posts').css('display', 'block');
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
