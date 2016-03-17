'use strict';

const async = require('async-q');

/*
type vkr = {
    method,
    params,
    options
}
*/

export function fetchAll(vkr, vkexec) {
    return vkexec(vkr).then(({count, items}) => fetchAllResume(vkr, vkexec, {count, offset: vkr.params.count, items}));
}

export function fetchAllResume(vkr, vkexec, {count, offset, items}) {
    let offsetList = buildOffsetList(count, offset, vkr.params.count);
    let vkrList = buildVKRList(vkr, offsetList);

    return async.map(vkrList, vkexec).then(results => {
        results.forEach(result => items.pushAll(result.items));
        return {
            count,
            items
        };
    });
}

function buildOffsetList(count, offset, limit) {
    let offsetList = [];

    while (offset <= count) {
        offsetList.push(offset);
        offset += limit;
    }

    return offsetList;
}

function buildVKRList({method, params, options}, offsetList) {
    return offsetList.map(offset => ({
        method,
        params: Object.assign({}, params, {offset}),
        options
    }));
}
