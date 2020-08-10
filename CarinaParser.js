const moment = require('moment');
const chrono = require('chrono-node');
const pomo = [' -p', ' -p ', '-p '];
const repeat = ['-r ', ' -r'];
const everyDay = [' daily', ' every day'];
const times = ['[0-9]+(.|:)+[0-9]+', '[0-9]+(am|pm)+'];
const defaultHour = 20;

function carinaParser(query) {
  let attributes = {};
  let newQuery = query;
  let newDate,
    newTime,
    recurring,
    pomo_estimate = null;
  let hasTime = false;
  let temp;

  repeat.map(item => {
    temp = query.match(RegExp(`${item} [0-9]+`, 'i'));
    if (temp) {
      let r = temp[0].match(RegExp('[0-9]+'))[0];
      recurring = r;
      newQuery = newQuery.replace(temp[0], '');
    }
  });

  pomo.map(item => {
    if (query.includes(item)) {
      temp = String(query.match(new RegExp(item + '[0-9]+')));
      let pomos = temp.replace(item, '');
      newQuery = newQuery.replace(temp, '');
      pomo_estimate = pomos;
    }
  });

  ['daily', 'every day', 'everyday'].map(item => {
    if (newQuery.includes(item)) {
      newQuery = newQuery.replace(item, '');
      recurring = 1;
    }
  });

  ['on the', ' the '].map(item => {
    if (newQuery.includes(item)) {
      newQuery = newQuery.replace(item, ' ');
    }
  });

  let results = chrono.parse(newQuery);
  if (results.length > 0) {
    let known = results[0].start.knownValues;
    let implied = results[0].start.impliedValues;
    let year = known.year || implied.year;
    let month = known.month || implied.month;
    let day = known.day || implied.day;
    let hour = known.hour || implied.hour;
    let minute = known.minute || implied.minute;

    if (implied.minute === 0 || known.minute === 0) {
      minute = 0;
    }

    let date = moment().set({
      year: year,
      month: month - 1,
      date: day,
      hour: hour,
      minute: minute,
    });

    if (known.hour) {
      hasTime = true;
    }

    newDate = date.format();
    newQuery = newQuery.replace(results[0].text, '');
  }

  attributes.newQuery = newQuery;
  if (newTime) {
    newDate = newDate.set({hour: newTime.hour(), minute: newTime.minute()});
    hasTime = true;
  }
  attributes.due_date = newDate;
  attributes.pomo_estimate = Number(pomo_estimate);
  attributes.hasTime = hasTime;
  attributes.recurring = recurring ? Number(recurring) : null;
  attributes.newQuery = attributes.newQuery.trim();

  return attributes;
}

module.exports = carinaParser;
