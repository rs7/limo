'use strict';

let express = require('express');

export let router = express.Router();

router.get('/rtrg.jpg', function (req, res, next) {
    res.redirect(301, 'http://vk.com/rtrg?r=vT3/TB*YlKCsXw4VECIEOn4Di4VK/Qjyt*0zF2kxYwh6gJ3I0EAYiwuQ21ThWjbQtslpnDlZkW5DgHPAem3foYsCwO3VtkEdvaA2aAcFCnSeKyyPhhyz8heNpW2gb4l4AEF8zG6ZkxYKgibhrCtzgXQgK*wPRFmj6dbHIPR1KWs-');
});
