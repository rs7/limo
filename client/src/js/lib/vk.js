'use strict';

import {resize} from './vk_sdk';

export function resizeFrame(height) {
    resize(null, height);
}
