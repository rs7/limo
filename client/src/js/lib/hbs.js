import Handlebars from 'handlebars';

import {printDate, printPeriod, timestamp} from './util';

export function initHelpers() {
    Handlebars.registerHelper("timestamp", date => timestamp(date));

    Handlebars.registerHelper("date", date => printDate(date));

    Handlebars.registerHelper("period", ({from, to}) => printPeriod(from, to));

    Handlebars.registerHelper("user_link", ({domain}) => `//vk.com/${domain}`);

    Handlebars.registerHelper("photo_link", ({owner_id, id}) => `//vk.com/photo${owner_id}_${id}`);

    Handlebars.registerHelper("user_name", ({first_name, last_name}) => `${first_name} ${last_name}`);
}
