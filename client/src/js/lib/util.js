'use strict';

export {printDate, printPeriod} from './printDate';
export {fetch, successCallback} from './net';
export {Deferred} from './util/promise';
export {concat, uniqueFilter} from './util/array';
export {ObjectId} from './util/ObjectId';
export {parseDate, parseObjectId} from './util/parse';
export {processArray, processObject} from './util/process';
export {currentTime, currentTimestamp, timestamp} from './util/datetime';

export function getUrlVars() {
    var vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
        function (m, key, value) {
            vars[key] = value;
        }
    );
    return vars;
}

export function stringSize(string) {
    return encodeURI(string).split(/%..|./).length - 1;
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

export function isString(value) {
    return typeof value === 'string' || value instanceof String;
}

export function isFunction(value) {
    return typeof value === 'function';
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

Object.defineProperty(Error.prototype, 'toJSON', {
    configurable: true,
    value: function () {
        var alt = {};
        var storeKey = function (key) {
            alt[key] = this[key];
        };
        Object.getOwnPropertyNames(this).forEach(storeKey, this);
        return alt;
    }
});
