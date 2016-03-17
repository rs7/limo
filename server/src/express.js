'use strict';

let express = require('express');

let bodyParser = require('body-parser');
let morgan = require('morgan');

const expressValidator = require('express-validator');
import {validators} from './validation';

export let app = express();

app.use(express.static('../client/build'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(expressValidator({customValidators: validators}));

app.use(morgan('dev'));
