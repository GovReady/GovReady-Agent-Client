import { default as config } from 'config';

export const timeOptions = {
  yest: window.moment().add(-1, 'days'),
  now: window.moment(),
  tom: window.moment().add(1, 'days')
};

// date in form: 2016-06-06T07:00:00.000Z
export function isoToDate (date: string) {
  return window.moment(date).format(config.dateFormat);
}

export function isValidDate(date: string) {
  return window.moment(date, config.dateFormat).isValid();
} 

// date in form June 6th 2016
export function dateToIso (date: string) {
  let moment = window.moment(date, config.dateFormat);
  if (moment.isValid()) {
    return moment.toISOString();
  } else {
    return window.moment().toISOString();
  }
}

// date in form June 6th 2016
export function dateToMoment (date: string) {
  let moment = window.moment(date, config.dateFormat);
  if (moment.isValid()) {
    return moment;
  } else {
    return window.moment();
  }
}

export function isoSort (collection, field = 'datetime', dir = 'asc') {
  return dir === 'asc'
    ? collection.sort((a, b) => (a[field] < b[field]) ? -1 : ((a[field] > b[field]) ? 1 : 0))
    : collection.sort((a, b) => (a[field] > b[field]) ? -1 : ((a[field] < b[field]) ? 1 : 0));
}
