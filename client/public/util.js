function createFieldMap(array, field) {
    var map = {};

    array.forEach(function (item) {
        var fieldValue = item[field];
        map[fieldValue] = item;
    });

    return map;
}

function getUrlVars() {
    var vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
        function (m, key, value) {
            vars[key] = value;
        }
    );
    return vars;
}

function printDate(date) {
    var boundary;

    //пять минут назад
    boundary = new Date();
    boundary.setMinutes(boundary.getMinutes() - 5);
    if (date >= boundary) {
        return 'только что';
    }

    //начало сегодняшнего дня
    boundary = new Date();
    boundary.setHours(0, 0, 0, 0);
    if (date >= boundary) {
        return 'сегодня';
    }

    //начало вчерашнего дня
    boundary = new Date();
    boundary.setDate(boundary.getDate() - 1);
    boundary.setHours(0, 0, 0, 0);
    if (date >= boundary) {
        return 'вчера';
    }

    var months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

    //начало года
    boundary = new Date();
    boundary.setMonth(0, 1);
    boundary.setHours(0, 0, 0, 0);
    if (date >= boundary) {
        return date.getDate() + ' ' + months[date.getMonth()];
    }

    //в прошлом году и старше
    return date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
}
