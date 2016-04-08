'use strict';

export {printDate, printPeriod} from './date';
export {fetch, responseCallback} from './net';
export {auto} from './util/async';
export {Deferred, timeout} from './util/promise';
export {uniqueFilter} from './util/array';
export {ObjectId} from './util/ObjectId';
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

export function currentTime() {
    return new Date().getTime();
}

export function currentTimestamp() {
    return timestamp(new Date());
}

export function stringSize(string) {
    return encodeURI(string).split(/%..|./).length - 1;
}

export function processArray(array, transform) {
    return array.map(item => processObject(item, transform));
}

export function processObject(object, transform) {
    let processed = {};

    Object.keys(transform).forEach(key => {
        let result = process(object[key], transform[key]);
        if (result) {
            processed[key] = result;
        }
    });

    return Object.assign({}, object, processed);
}

function process(value, transform) {
    switch (true) {
        case isUndefined(value):
        case isUndefined(transform):
            return;

        case isScalar(transform):
            return transform;

        case transform instanceof Function:
            return transform(value);

        case Array.isArray(transform):
            return processArray(value, transform[0]);

        case transform instanceof Object:
            return processObject(value, transform);

        default:
            console.error('Неподдерживаемый тип преобразования объекта');
            return value;
    }
}

export function isBetween(value, from, to, compare) {
    return compare(from, value) > 0 && compare(to, value) < 0;
}

export function isUndefined(value) {
    return typeof value == 'undefined';
}

export function isScalar(value) {
    return /boolean|number|string/.test(typeof value);
}

export function numeralDeclension(value, forms012) {
    return forms012[index(value)];

    function index(value) {
        switch (value % 100) {
            case 11:
            case 12:
            case 13:
            case 14:
                return 0;
        }

        switch (value % 10) {
            case 1:
                return 1;
            case 2:
            case 3:
            case 4:
                return 2;
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 0:
                return 0;
        }
    }
}

export function escapeSecret(value) {
    return [
        [/[0-9a-fA-F]{85}/g, '%HASH85%'],
        [/[0-9a-fA-F]{32}/g, '%HASH32%'],
        ['X:\\\\work\\\\limo\\\\server', '%SERVER_PATH%']
    ].reduce(
        (value, [pattern, replace]) => value.replace(pattern, replace), value
    );
}
