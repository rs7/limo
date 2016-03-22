'use strict';

function currentTime() {
    return new Date().getTime();
}

class Throttle {
    constructor(time, count) {
        this.time = time;
        this.count = count;
        this.memory = new Array(count).fill(currentTime() - time);
    }

    next() {
        let delay = this.delay();
        let time = currentTime() + delay;

        this.memory.push(time);
        this.memory = this.memory.slice(-this.count);

        return delay;
    }

    delay() {
        let time = this.memory.first() + this.time - currentTime();

        return Math.max(0, time);
    }
}

export let throttle = new Throttle(3000, 9);
