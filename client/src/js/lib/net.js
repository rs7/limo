'use strict';

const $ = require('jquery');

let id = 1000;

function getId() {
    return ++id;
}

export function fetch(params) {
    let id = getId();

    console.rec({id, fetch: params});

    return new Promise((resolve, reject) =>
        $.ajax(params).then(
            successCallback(id, resolve, reject),
            failCallback(id, reject)
        )
    );
}

function failCallback(id, reject) {
    return jqXHR => {
        let error = jqXHRError(jqXHR);

        console.rec({id, fail: error});

        reject(error);
    };

    function jqXHRError(jqXHR) {
        return {
            response: jqXHR.responseText,
            status: jqXHR.status,
            statusText: jqXHR.statusText
        };
    }
}

export function successCallback(id, resolve, reject) {
    return result => {
        console.rec({id, success: result});

        if (result.response != undefined) {
            resolve(result.response);
            return;
        }

        reject(result.error || result);
    };
}
