'use strict';

export function timestamp(date) {
    return Math.floor(date.getTime() / 1000);
}

export function currentTime() {
    return new Date().getTime();
}

export function currentTimestamp() {
    return timestamp(new Date());
}

export function parseTimer(time) {
    let sign = time <= -1000 ? '-' : '';
    let seconds = String(Math.floor(Math.abs(time / 1000) % 60)).pad('00');
    let minutes = String(Math.floor(Math.abs(time / 1000 / 60)));

    return {minutes, seconds, sign};
}

export class Timer {
    constructor(startTime, stopTime, interval) {
        this.startTime = startTime;
        this.stopTime = stopTime;
        this.interval = interval;
    }

    start(update = Function()) {
        this.currentTime = this.startTime;
        this.update = update;
        this.timer = setInterval(() => this.tick(), Math.abs(this.interval));
        this.update(this.currentTime);
    }

    stop() {
        clearInterval(this.timer);
        this.update = undefined;
    }

    tick() {
        this.currentTime += this.interval;

        if (this.currentTime <= this.stopTime) {
            this.update(this.currentTime);
        } else {
            this.stop();
        }
    }
}

export class Duration {
    get() {
        return this.finishTime - this.startTime;
    }

    start() {
        this.startTime = currentTime();
    }

    stop() {
        this.finishTime = currentTime();
    }
}
