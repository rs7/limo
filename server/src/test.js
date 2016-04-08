'use strict';

import {mongoose, Feed} from './db';

const OWNER = 1052662;
const PHOTOS = [404, 186063354, 265643362, 273263115, 280134965, 284160443, 298490651, 299328128, 300859215, 300908802, 304101403, 312964640, 315332500, 318194034, 296458165, 318700763, 320139016, 320139102, 323571338, 324186596, 323349119, 328161314, 313779488, 335355885, 336774329, 338104511, 290355736, 346605826, 349652797, 354872156, 375161548, 382069629, 393135726, 285076967, 344561132, 358693393];
const USERS = [{
    id: 301419447,
    first_name: 'Патриарх',
    last_name: 'Кирилл'
}, {
    id: 53083705,
    first_name: 'Дмитрий',
    last_name: 'Медведев'
}, {
    id: 150923881,
    first_name: 'Анатолий',
    last_name: 'Локоть'
}, {
    id: 38940203,
    first_name: 'Владимир',
    last_name: 'Жириновский'
}, {
    id: 41362423,
    first_name: 'Геннадий',
    last_name: 'Зюганов'
}, {
    id: 209991765,
    first_name: 'Sasha',
    last_name: 'Grey'
}, {
    id: 205387401,
    first_name: 'Tom',
    last_name: 'Cruise'
}];

const NOW = new Date();

function getRandomArrayItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function getRandomDate(from, to) {
    return new Date(from.getTime() + Math.random() * (to.getTime() - from.getTime()));
}

const PERIOD = [
    function () {
        let from = getRandomDate(new Date(2013, 0), NOW);
        let to = getRandomDate(from, NOW);
        return {from, to};
    },
    function () {
        let from = getRandomDate(new Date(2014, 0), NOW);
        let to = getRandomDate(from, new Date(from.getFullYear(), from.getMonth(), from.getDate() + 1));
        return {from, to};
    },
    function () {
        let from = getRandomDate(new Date(NOW.getFullYear(), NOW.getMonth(), NOW.getDate() - 2), NOW);
        let to = getRandomDate(from, NOW);
        return {from, to};
    },
    function () {
        let from = getRandomDate(new Date(2014, 0), new Date(NOW.getFullYear(), NOW.getMonth(), NOW.getDate() - 2));
        let to = getRandomDate(new Date(NOW.getFullYear(), NOW.getMonth(), NOW.getDate() - 2), NOW);
        return {from, to};
    }
];

function unlikePhotoFeed() {
    return {
        type : 'unlike_photo',
        photo : getRandomArrayItem(PHOTOS),
        user : getRandomArrayItem(USERS).id,
        owner : OWNER,
        period : getRandomArrayItem(PERIOD)()
    };
}

function unfriendFeed() {
    return {
        type : 'unfriend',
        user : getRandomArrayItem(USERS).id,
        owner : OWNER,
        period : getRandomArrayItem(PERIOD)()
    };
}

function unfollowerFeed() {
    return {
        type : 'unfollower',
        user : getRandomArrayItem(USERS).id,
        owner : OWNER,
        period : getRandomArrayItem(PERIOD)()
    };
}

const FEED = [
    unlikePhotoFeed, unfriendFeed, unfollowerFeed
];

function createRandomFeed() {
    return getRandomArrayItem(FEED)();
}

let feeds = [];

let i = 50;
while(i--) {
    feeds.push(createRandomFeed());
}

Feed.remove({}).then(() => {
    console.log('--- очищено');
    Feed.insertMany(feeds).then(() => {
        console.log('--- тестовые данные добавлены');
        mongoose.disconnect().then(() => {
            console.log('--- соединение закрыто');
        });
    });
});

