const Handlebars = require('handlebars');

import {printDate, printPeriod, timestamp, numeralDeclension, escapeSecret} from './../lib/util';

export function initHelpers() {
    Handlebars.registerHelper('timestamp', date => timestamp(date));

    Handlebars.registerHelper('date', date => printDate(date));

    Handlebars.registerHelper('period', ({from, to}) => printPeriod(from, to));

    Handlebars.registerHelper('user_link', ({domain}) => `//vk.com/${domain}`);

    Handlebars.registerHelper('photo_link', ({owner_id, id}) => `//vk.com/photo${owner_id}_${id}`);

    Handlebars.registerHelper('post_link', ({owner_id, id}) => `//vk.com/wall${owner_id}_${id}`);

    Handlebars.registerHelper('user_name', ({first_name, last_name}) => `${first_name} ${last_name}`);

    Handlebars.registerHelper('user_name_case', (user, nameCase) =>
        `${user[`first_name_${nameCase}`]} ${user[`last_name_${nameCase}`]}`
    );

    Handlebars.registerHelper('item', (index, ...values) => values[index]);

    Handlebars.registerHelper('num_decl', (value, ...forms012) => numeralDeclension(value, forms012));

    Handlebars.registerHelper('json', value => JSON.stringify(value, null, 2));

    Handlebars.registerHelper('escape', value => escapeSecret(value));
}