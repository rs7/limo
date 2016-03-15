'use strict';

let express = require('express');

export let router = express.Router();

import {getFeed, validateObjectId} from '../model';
import {sliceObject} from '../util';

router.get('/feed', function (req, res, next) {
    let {user, from} = req.query;

    let query = {
        user
    };

    if (validateObjectId(from)) {
        Object.assign(query, {from})
    }

    const OUTPUT_KEYS = ['id', 'photo', 'user', 'period'];

    getFeed(query).then(feeds => {
        let response = feeds.map(feed => sliceObject(feed, OUTPUT_KEYS));
        res.json({response});
    }).catch(next);
});
