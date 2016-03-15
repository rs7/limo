'use strict';

const async = require('async-q');

Array.prototype.first = function () {
    return this[0];
};

Array.prototype.last = function () {
    return this[this.length - 1];
};

Array.prototype.isEmpty = function () {
    return this.length == 0;
};

Array.prototype.pushAll = function(array) {
    this.push.apply(this, array);
};

export function auto(tasks, {returnTask, log} = {}) {
    if (log) {
        Object.keys(tasks).forEach(task => tasks[`__AUTO_LOG_${task}`] = [task, results => console.log(`AUTO_LOG ${task} => `, results[task])]);
    }

    return new Promise((resolve, reject) => {
        async.auto(tasks).then(results => resolve(results[returnTask]), reject);
    });
}

export function mapById(array) {
    return new Map(array.map(item => [item.id, item]));
}

export function getUrlVars() {
    var vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
        function (m, key, value) {
            vars[key] = value;
        }
    );
    return vars;
}

export {printDate, printPeriod} from './date';

export function uniqueFilter(value, index, self) {
    return self.indexOf(value) === index;
}

export function timestamp(date) {
    return Math.floor(date.getTime() / 1000);
}

export function processArray(array, process) {
    return array.map(item => processObject(item, process));
}

export function processObject(object, process) {
    let processed = {};

    Object.keys(process).forEach(key => {
        let proc = process[key];
        let val = object[key];
        let res;

        switch (true) {
            case proc instanceof Function:
                res = proc(val);
                break;

            case proc instanceof Object:
                res = processObject(val, proc);
                break;

            default:
                console.error('Неподдерживаемый тип преобразования объекта');
                res = val;
        }

        processed[key] = res;
    });

    return Object.assign({}, object, processed);
}

export function parseDate(date) {
    return new Date(date);
}

export function stringSize(string) {
    return encodeURI(string).split(/%..|./).length - 1;
}

export class ObjectId {
    static compare(a, b) {
        return a.date - b.date || a.machine - b.machine || a.process - b.process || a.counter - b.counter;
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

export function parseObjectId(value) {
    return new ObjectId(value);
}
