'use strict';

const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let RecSchema = new Schema({
    user: {type: Number, required: true},
    date: {type: Date, required: true},
    rows: []
}, {
    strict: 'throw',
    id: false
});

export let Rec = mongoose.model('Rec', RecSchema);
