'use strict';

let data;

export function initText() {
    data = JSON.parse(document.getElementById('text').innerHTML);
}

export function getText(key) {
    return data[key] || `{${key}}`;
}
