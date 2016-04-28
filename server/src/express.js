'use strict';

const express = require('express');

const bodyParser = require('body-parser');
const path = require('path');

const expressValidator = require('express-validator');

import {validators} from './validation';

export let app = express();

let staticPath = path.join(__dirname, './../../client/build');

console.log('Клиентское приложение:', staticPath);

app.use(express.static(staticPath));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({limit: '50mb'}));

app.use(expressValidator({customValidators: validators}));
