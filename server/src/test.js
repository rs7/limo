'use strict';

const OWNER = [{
    id: 1052662,
    photos: [404, 186063354, 265643362, 273263115, 280134965, 284160443, 298490651, 299328128, 300859215, 300908802, 304101403, 312964640, 315332500, 318194034, 296458165, 318700763, 320139016, 320139102, 323571338, 324186596, 323349119, 328161314, 313779488, 335355885, 336774329, 338104511, 290355736, 346605826, 349652797, 354872156, 375161548, 382069629, 393135726, 285076967, 344561132, 358693393]
}, {
    id: 45147844,
    photos: [404, 356693075]
}];

let argv = require('optimist')
    .usage('Usage: $0 [-x] -c[number] -u[index]')
    .boolean('x')
    .default('c', 5)
    .check(({u}) => {
        if(!OWNER[u]) throw `available user index:\n${OWNER.map(({id}, index) => `${index}: ${id}`).join('\n')}`;
    })
    .argv
;

let user = OWNER[argv.u];

import {mongoose, Feed} from './db';

const USERS = [301419447/*Патриарх Кирилл*/, 53083705/*Дмитрий Медведев*/, 150923881/*Анатолий Локоть*/, 38940203/*Владимир Жириновский*/, 41362423/*Геннадий Зюганов*/, 209991765/*Sasha Grey*/, 205387401/*Tom Cruise*/];

const NOW = new Date();

function getRandomArrayItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

let count = 0;
let date = NOW;

function getPeriod() {
    let from = new Date(date.getTime() - getRandomArrayItem([3, 12, 24, 24 * 3, 24 * 30].slice(0, ++count)) * 1000 * 60 * 60);
    let to = new Date(date.getTime());
    date = from;
    return {from, to};
}

function getUser() {
    return Math.floor(1 + Math.random() * 359446589);
}

function getFeed() {
    return {
        user : getUser(),
        owner : user.id,
        period : getPeriod()
    };
}

function unlikePhotoFeed() {
    return Object.assign({
        type : 'unlike_photo',
        photo : getRandomArrayItem(user.photos)
    }, getFeed());
}

function unfriendFeed() {
    return Object.assign({
        type : 'unfriend'
    }, getFeed());
}

function unfollowFeed() {
    return Object.assign({
        type : 'unfollow'
    }, getFeed());
}

const FEED = [unlikePhotoFeed, unfriendFeed, unfollowFeed];

function createRandomFeed() {
    return getRandomArrayItem(FEED)();
}

function clear() {
    console.log('>_<', user.id);
    return Feed.remove({owner: user.id});
}

function insert(count) {
    console.log('^_^', user.id, count);
    let feeds = new Array(count).fill(1).map(createRandomFeed).reverse();
    return Feed.insertMany(feeds);
}

(argv.x?clear():Promise.resolve()).then(() => insert(argv.c)).then(() => mongoose.disconnect());
