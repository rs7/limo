'use strict';

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

export function kvArrayToObject(kvArray) {
    return kvArray.reduce(
        (result, kvPair) => Object.assign(result, kvToObject(kvPair)), {}
    );

    function kvToObject(kvPair) {
        return {
            [kvPair[0]]: kvPair[1]
        };
    }
}

export function objectToKVArray(object) {
    return Object.keys(object).map(key => [key, object[key]]);
}

export function mapById(array) {
    return new Map(array.map(item => [item.id, item]));
}

export class Counter {
    constructor(startValue = 0) {
        this.id = startValue;
    }

    getNext() {
        return this.id++;
    }
}
