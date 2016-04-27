'use strict';

require('babel-polyfill');

const browserInfo = require('browser-info');

const log = console.log;
const warn = console.warn;
const error = console.error;

function appendMarker(args) {
    return ['\uD83D\uDCF0'].concat(args);
}

Object.assign(console, {
    log: (...args) => log.apply(console, appendMarker(args)),
    warn: (...args) => warn.apply(console, appendMarker(args)),
    error: (...args) => error.apply(console, appendMarker(args)),
    rec: record => write(record),
    sendRec: send
});

let git = '{{git}}';
let browser = browserInfo();
let timestamp = Date.now() / 1000 ^ 0;

let recRows = [{git, browser, timestamp}];

function send() {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/rec', true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(JSON.stringify(recRows));
}

function write(row) {
    recRows.push(row);
}
