'use strict';

import {mapById} from './../util/util';

export function complete(ids, results, stub) {
    let map = mapById(results);

    return ids.map(id => map.get(id) || stub(id));
}
