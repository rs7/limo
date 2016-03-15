'use strict';

let assert = require('assert');

import {Feed} from '../src/db';

function feed(data) {
    return new Feed(data).validateSync();
}

describe('Валидация схем', function () {

    describe('Feed', function () {

        it('Валидная схема', function () {
            assert.equal(undefined, feed({
                owner: 1052662,
                photo: 324186596,
                user: 53083705,
                period : {
                    from: new Date(2016, 0, 1),
                    to: new Date(2016, 2, 15)
                }
            }));
        });

    });
});
