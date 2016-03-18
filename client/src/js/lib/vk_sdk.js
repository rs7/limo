'use strict';

export function resize(width, height) {
    return VK.callMethod('resizeWindow', width, height);
}

export let api = VK.api;
