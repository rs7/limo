'use strict';

import {currentTime} from '../util';

class Throttle {
    constructor(time, count) {
        this.time = time;
        this.count = count;
        this.memory = new Array(count).fill(currentTime() - this.time);
        this.timer = null;
    }

    when(n = 0) {
        let time = this.memory[n] + this.time - currentTime();

        return Math.max(0, time);
    }

    next() {
        let delay = this.when();
        let time = currentTime() + delay;

        this.memory.push(time);
        this.memory = this.memory.slice(-this.count);

        return delay;
    }

    vacancy() {
        let now = currentTime();
        return this.memory.filter(time => time + this.time <= now).length;
    }
}

export let throttle = new Throttle(3000, 9);
