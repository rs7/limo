'use strict';

const _ = '_';

export let API = {
    photos: {
        get: {
            public: 1,
            list: {
                limit: 1000
            }
        },
        getById: {
            public: 1
        }
    },

    likes: {
        getList: {
            public: 1,
            list: {
                limit: 1000
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
