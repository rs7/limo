'use strict';

import async from 'async-q';

export function auto(tasks, {returnTask, log} = {}) {
    if (log) {
        Object.keys(tasks).forEach(task => tasks[`__AUTO_LOG_${task}`] = [task, results => console.log(`AUTO_LOG ${task} => `, results[task])]);
    }

    return new Promise((resolve, reject) => {
        async.auto(tasks).then(results => resolve(results[returnTask]), reject);
    });
}

export function mapById(array) {
    return new Map(array.map(item => [item.id, item]));
}

export function getUrlVars() {
    var vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
        function (m, key, value) {
            vars[key] = value;
        }
    );
    return vars;
}

export function printDate(date) {
    var boundary;

    //пять минут назад
    boundary = new Date();
    boundary.setMinutes(boundary.getMinutes() - 5);
    if (date >= boundary) {
        return 'только что';
    }

    //начало сегодняшнего дня
    boundary = new Date();
    boundary.setHours(0, 0, 0, 0);
    if (date >= boundary) {
        return 'сегодня';
    }

    //начало вчерашнего дня
    boundary = new Date();
    boundary.setDate(boundary.getDate() - 1);
    boundary.setHours(0, 0, 0, 0);
    if (date >= boundary) {
        return 'вчера';
    }

    var months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

    //начало года
    boundary = new Date();
    boundary.setMonth(0, 1);
    boundary.setHours(0, 0, 0, 0);
    if (date >= boundary) {
        return date.getDate() + ' ' + months[date.getMonth()];
    }

    //в прошлом году и старше
    return date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
}

export function uniqueFilter(value, index, self) {
    return self.indexOf(value) === index;
}

export function timestamp(date) {
    return Math.floor(date.getTime() / 1000);
}

export function processArray(array, process) {
    return array.map(item => processObject(item, process));
}

export function processObject(object, process) {
    let processed = {};

    Object.keys(process).forEach(key => {
        let proc = process[key];
        let val = object[key];
        let res;

        switch (true) {
            case proc instanceof Function:
                res = proc(val);
                break;

            case proc instanceof Object:
                res = processObject(val, proc);
                break;

            default:
                console.error('Неподдерживаемый тип преобразования объекта');
                res = val;
        }

        processed[key] = res;
    });

    return Object.assign({}, object, processed);
}

export function parseDate(date) {
    return new Date(date);
}
