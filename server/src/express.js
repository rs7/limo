'use strict';

let express = require('express');

let bodyParser = require('body-parser');

const expressValidator = require('express-validator');
import {validators} from './validation';

export let app = express();

app.use(express.static('../client/build'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({limit: '50mb'}));

app.use(expressValidator({customValidators: validators}));
