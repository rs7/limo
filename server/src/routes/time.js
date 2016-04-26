'use strict';

let express = require('express');

export let router = express.Router();

router.get('/time', function (req, res, next) {
    let time =  new Date().getTime() / 1000 ^ 0;

    res.json({response: time});
});
