'use strict';

import {isUndefined, isScalar} from './../util';

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
