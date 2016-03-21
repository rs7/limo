'use strict';

export {printDate, printPeriod} from './date';
export {fetch, responseCallback} from './net';
export {auto} from './util/async';
export {Deferred, timeout} from './util/promise';
export {uniqueFilter} from './util/array';
export {ObjectId} from './util/objectId';
export {parseDate, parseObjectId} from './util/parse';

export function getUrlVars() {
    var vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
        function (m, key, value) {
            vars[key] = value;
        }
    );
    return vars;
}

export function timestamp(date) {
    return Math.floor(date.getTime() / 1000);
}

export function stringSize(string) {
    return encodeURI(string).split(/%..|./).length - 1;
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
