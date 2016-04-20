'use strict';

import {concat} from './../util/array';

export function aggregate(request, executor, from, to, limit) {
    if (!from) {
        from = 0;
    }

    if (!limit) {
        limit = request.method.list.limit;
    }

    if (to) {
        return getList(request, executor, from, to, limit);
    }

    return getListToEnd(request, executor, from, limit);
}

function getListToEnd(request, executor, from, limit) {
    return getList(request, executor, from, limit, limit).then(
        ({count, items}) => {
            let to = count;

            if (limit >= count) {
                return result(items, count, from, to);
            }

            let items0 = items;

            return getList(request, executor, limit, count, limit).then(
                ({items: items1}) => {
                    let items = concat([items0, items1]);

                    return result(items, count, from, to);
                }
            );
        }
    );
}

function getList(request, executor, from, to, limit) {
    let requests = getListParams(from, to, limit).map(params => populateRequest(request, params));

    return Promise.all(
        requests.map(executor)
    ).then(results => {
        let count = results.first().count;
        let items = concat(results.map(result => result.items));
        return result(items, count, from, to);
    });
}

function result(items, count, from, to) {
    return {items, count, from, to};
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
    };
}
