'use strict';

import $ from 'jquery';

import {resize} from './vk_sdk';

export function updateFrameSize() {
    resize(null, $('body').outerHeight());
}
