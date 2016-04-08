'use strict';

const $ = require('jquery');

export function fetch(params) {
    return new Promise((resolve, reject) =>
        $.ajax(params).then(
            responseCallback(resolve, reject),
            (jqXHR) => reject(jqXHRError(jqXHR))
        )
    );
}

function jqXHRError(jqXHR) {
    return {
        response: jqXHR.responseText,
        status: jqXHR.status,
        statusText: jqXHR.statusText
    };
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
