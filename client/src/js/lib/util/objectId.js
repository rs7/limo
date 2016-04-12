'use strict';

import {currentTimestamp} from './../util';

export class ObjectId {
    static compare(a, b) {
        return a.date - b.date || a.machine - b.machine || a.process - b.process || a.counter - b.counter;
    }

    static now() {
        return new ObjectId(`${currentTimestamp().toString(16)}${'0'.repeat(16)}`);
    }

    static validate(value) {
        return /^[0-9a-fA-F]{24}$/.test(value);
    }

    constructor(value) {
        this.value = value;
        this.date = new Date(parseInt(this.value.slice(0, 8), 16) * 1000);
        this.machine = parseInt(this.value.slice(8, 14), 16);
        this.process = parseInt(this.value.slice(14, 18), 16);
        this.counter = parseInt(this.value.slice(18, 25), 16);
    }

    toString() {
        return this.value;
    }
}
