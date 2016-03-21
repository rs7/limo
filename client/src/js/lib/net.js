'use strict';

const $ = require('jquery');

export function fetch(params) {
    return new Promise((resolve, reject) =>
        $.ajax(params).then(
            responseCallback(resolve, reject),
            reject
        )
    );
}

export function responseCallback(resolve, reject) {
    return function (result) {
        if (result.response != undefined) {
            resolve(result.response);
            return;
        }

        reject(result.error || result);
    };
}
