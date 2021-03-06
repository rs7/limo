'use strict';

import {user} from './../params';

export let API = {

    _: {
        execute: {
        }
    },

    friends: {
        get: {
            default: {
                user_id: user
            }
        }
    },

    likes: {
        getList: {
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

    photos: {
        get: {
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
        }
    },

    storage: {
        set: {
        }
    },

    subscriptions:{
        get: {
            list: {
                limit: 1000
            },
            default: {
                uid: user,
                offset: 0,
                count: 100
            }
        }
    },

    users: {
        get: {
            default: {
                user_ids: user,
                fields: '',
                name_case: 'nom'
            }
        },
        getFollowers : {
            list: {
                limit: 1000
            },
            default: {
                user_id: user,
                offset: 0,
                count: 100
            }
        }
    },

    wall: {
        get: {
            list: {
                limit: 100
            },
            default: {
                owner: user,
                offset: 0,
                count: 20
            }
        },
        getById: {
        }
    }

};

function createNames() {
    Object.keys(API).forEach(group =>
        Object.keys(API[group]).forEach(method =>
            API[group][method].name = createName(group, method)
        )
    );

    function createName(group, method) {
        if (group == '_') {
            return method;
        }

        return `${group}.${method}`;
    }
}

createNames();
