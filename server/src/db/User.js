'use strict';

const mongoose = require('mongoose');

let Schema = mongoose.Schema;

import {SnapshotSchema} from './Snapshot';

let UserSchema = new Schema({
    id: {type: Number, required: true},
    snapshot: {type: SnapshotSchema, required: true}
}, {
    strict: 'throw',
    id: false
});

UserSchema.index({id: 1}, {unique: true});

export let User = mongoose.model('User', UserSchema);
