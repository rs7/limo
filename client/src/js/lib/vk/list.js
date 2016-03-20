'use strict';

const async = require('async-q');

import {auto} from '../util';

export function get(request, exec, from = 0, to = -1, limit = 0) {
    if (limit == 0) {
        limit = request.method.list.limit;
    }

    if (to === -1) {
        return doGet(request, exec, from, limit, limit).then(({count, items}) => {
            from = limit;
            to = count;

            if (from >= to) {
                return {from, to, count, items};
            }

            let firstItems = items;

            return doGet(request, exec, from, to, limit).then(({from, to, items: otherItems}) => {
                let items = [].concat(firstItems, otherItems);

                return {from, to, count, items};
            });
        });
    }

    return doGet(request, exec, from, to, limit);
}

export function doGet(request, exec, from, to, limit) {
    let requests = getListParams(from, to, limit).map(params => populateRequest(request, params));

    return async.map(requests, exec).then(results => {
        let count = results.first().count;
        let items = Array.prototype.concat.apply([],
            results.map(result => result.items)
        );
        return {from, to, count, items};
    });
}

function getListParams(from, to, limit) {
    let params = [];

    while (true) {
        let count = to - from;

        if (count <= 0) {
            break;
        }

        params.push({
            offset: from,
            count: Math.min(limit, count)
        });

        from += limit;
    }

    return params;
}

function populateRequest({method, params, options}, {count, offset}) {
    return {
        method,
        params: Object.assign({}, params, {count, offset}),
        options
    }
}
