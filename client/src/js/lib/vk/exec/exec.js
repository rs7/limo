'use strict';

import {Deferred} from '../../util';

import {populate} from '../options';

import {pub} from './pub';
import {priv} from './priv';
import {exe} from './exe';
import {sdk} from './sdk';

let queue = [];

export function exec({method, params, options}) {
    let request = {
        method,
        params: populate(params, options)
    };

    console.log('exec', request);

    if (request.method.name == 'execute') {
        return sdk(request);
    }

    let deferred = new Deferred();

    queue.push({
        request,
        deferred
    });

    return deferred.promise;
}

function send() {
    let items = queue.splice(0, 25);

    if (items.length == 0) {
        return;
    }

    exe(items.map(item => item.request)).then(results =>
        results.forEach(
            (result, index) => items[index].deferred.resolve(result)
        )
    ).catch(error =>
        items.forEach(item => item.deferred.reject(error))
    );
}

function timer() {
    send();
    setTimeout(timer, 400);
}

timer();
