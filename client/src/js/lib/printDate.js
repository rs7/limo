'use strict';

export function printDate(date) {
    if (date >= fiveMinuteAgo()) {
        return 'только что';
    }

    return printDay(date);

    function fiveMinuteAgo() {
        let now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() - 5, 0, 0);
    }
}

export function printPeriod(from, to) {
    if (isSameDay(from, to)) {
        return printDay(to);
    }

    let forceYear = !isSameYear(from, to);

    return `${printDay(from, forceYear)} — ${printDay(to, forceYear)}`;

    function isSameDay(a, b) {
        return a.getFullYear() == b.getFullYear() && a.getMonth() == b.getMonth() && a.getDate() == b.getDate();
    }

    function isSameYear(a, b) {
        return a.getFullYear() == b.getFullYear();
    }
}

function printDay(date, forceYear = false) {
    if (date >= startOfToday()) {
        return 'сегодня';
    }

    if (date >= startOfTomorrow()) {
        return 'вчера';
    }

    return printFullDate(date, forceYear);

    function startOfToday() {
        let now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    }

    function startOfTomorrow() {
        let now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 0, 0, 0);
    }
}

function printFullDate(date, forceYear = false) {
    if (!forceYear && date >= startOfYear()) {
        return shortDate();
    }

    return fullDate();

    function startOfYear() {
        let now = new Date();
        return new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
    }

    function monthName(month) {
        return ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'][month];
    }

    function shortDate() {
        return `${date.getDate()} ${monthName(date.getMonth())}`;
    }

    function fullDate() {
        return `${date.getDate()} ${monthName(date.getMonth())} ${date.getFullYear()}`;
    }
}
