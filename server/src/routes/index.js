'use strict';

import {router as feed} from './feed';
import {router as snapshot} from './snapshot';
import {router as rec} from './rec';
import {router as time} from './time';
import {router as rtrg} from './rtrg';

export function routes(app) {
    app.use(feed);
    app.use(snapshot);
    app.use(rec);
    app.use(time);
    app.use(rtrg);
}
