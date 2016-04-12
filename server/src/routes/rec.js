'use strict';

let express = require('express');

export let router = express.Router();

import {saveRec} from './../model';

router.post('/rec', function (req, res, next) {
    let rec = {
        date: new Date(),
        rows: req.body
    };

    saveRec(rec).catch(next).then(() =>
        res.json({response: 1})
    );
});
