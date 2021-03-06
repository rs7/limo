'use strict';

import {kvArrayToObject, objectToKVArray} from './util';

export function createURIQuery(params) {
    return encodeURI(objectToKVArray(params).map(pair => pair.join('=')).join('&'));
}

export function parseURIQuery(query) {
    return kvArrayToObject(query.split('&').map(kvSplit));

    //Делать .split('=') нельзя из-за бага: vk.com/bugs?act=show&id=1052662_22
    function kvSplit(pair) {
        let index = pair.indexOf('=');
        return [
            pair.slice(0, index),
            pair.slice(index + 1)
        ].map(decodeURIComponent);
    }
}

export function getParamsFromURI(uri) {
    let query = uri.slice(uri.indexOf('?') + 1);
    return parseURIQuery(query);
}

export function jsonResultHandler(result) {
    if (result.response != undefined && result.error == undefined) {
        return result.response;
    }

    if (result.error != undefined && result.response == undefined) {
        throw result.error;
    }

    throw result;
}

export function xhrErrorHandler(xhr) {
    throw {
        response: xhr.responseText,
        status: xhr.status,
        statusText: xhr.statusText
    };
}

function xhrProgressHandler(progress) {
    return event => progress(event.lengthComputable ? event.loaded / event.total : -1);
}

export function xhrProgressFactory(progress) {
    let xhr = new XMLHttpRequest();
    xhr.onprogress = xhrProgressHandler(progress);
    return xhr;
}
