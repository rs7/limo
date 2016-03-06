import Handlebars from 'handlebars';

import {printDate, timestamp} from './util';

export function initHelpers() {
    Handlebars.registerHelper("timestamp", date => timestamp(date));

    Handlebars.registerHelper("date", date => printDate(date));
}
