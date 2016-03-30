'use strict';

import {user} from '../params';

const _ = '_';

export let API = {
    photos: {
        get: {
            public: 1,
            list: {
                limit: 1000
            },
            default: {
                owner_id: user,
                offset: 0,
                count: 1000
            }
        },
        getAlbums: {
            default: {
                owner_id: user
            }
        },
        getById: {
            public: 1
        },
        getAll: {
            list: {
                limit: 200
            },
            default: {
                owner_id: user,
                offset: 0,
                count: 20
            }
        }
    },

    likes: {
        getList: {
            public: 1,
            list: {
                limit: 1000
            },
            default: {
                owner_id: user,
                offset: 0,
                count: 100
            }
        }
    },

    users: {
        get: {
            public: 1
        }
    },

    storage: {
        set: {}
    },

    [_]: {
        execute: {}
    }
};

function createNames() {
    Object.keys(API).forEach(group =>
        Object.keys(API[group]).forEach(method =>
            API[group][method].name = createName(group, method)
        )
    );

    function createName(group, method) {
        if (group == _) {
            return method;
        }

        return `${group}.${method}`;
    }
}

createNames();
