'use strict';

import {syncArrays} from './../util/array';

export class Cache {
    constructor(worker) {
        this.worker = worker;
        this.cache = new Map();
    }

    get(ids) {
        if (ids.isEmpty()) {
            return Promise.resolve([]);
        }

        let lacked = ids.filter(id => !this.cache.has(id));

        if (lacked.isEmpty()) {
            return Promise.resolve(ids.map(id => this.cache.get(id)));
        }

        return this.worker(ids).then(
            results => syncArrays([ids, results]).forEach(
                ([id, result]) => this.cache.set(id, result)
            )
        ).then(
            () => ids.map(id => this.cache.get(id))
        );
    }
}
