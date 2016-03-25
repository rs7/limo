'use strict';

const async = require('async-q');

export function aggregate(request, executor, from = 0, to = -1, limit = 0) {
    if (limit == 0) {
        limit = request.method.list.limit;
    }

    if (to === -1) {
        return getList(request, executor, from, limit, limit).then(({count, items}) => {
            to = count;

            if (limit >= to) {
                return {from, to, count, items};
            }

            from = limit;

            let firstItems = items;

            return getList(request, executor, from, to, limit).then(({items: otherItems}) => {
                let items = [].concat(firstItems, otherItems);

                return {from, to, count, items};
            });
        });
    }

    return getList(request, executor, from, to, limit);
}

function getList(request, exec, from, to, limit) {
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
