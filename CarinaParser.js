const moment = require('moment');
const chrono = require('chrono-node');
const today = [' td', 'td ', 'today'];
const tomorrow = [' tm(?![a-z])', 'tomorrow'];
const inDays = 'in [0-9]* day[a-z]*';
const pomo = [' -p', ' -p ', '-p '];
const repeat = ['-r ', ' -r'];
const months = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
];

const next = ['week', 'month', 'year'];
const days = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];
const everyDay = [' daily', ' every day'];
const times = ['[0-9]+(.|:)+[0-9]+', '[0-9]+(am|pm)+'];
const defaultHour = 20;

function carinaParser(query) {
  let attributes = {};
  let newQuery = query;
  let newDate,
    newTime,
    repeat_every,
    pomo_estimate = null;
  let hasTime = false;
  let temp;

  repeat.map(item => {
    temp = query.match(RegExp(`${item} [0-9]+`, 'i'));
    if (temp) {
      let r = temp[0].match(RegExp('[0-9]+'))[0];
      repeat_every = r;
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

  let results = chrono.parse(newQuery);
  if (results.length > 0) {
    let known = results[0].start.knownValues;
    let implied = results[0].start.impliedValues;
    let year = known.year || implied.year;
    let month = known.month || implied.month;
    let day = known.day || implied.day;
    let hour = known.hour || implied.hour;
    let minute = known.minute || implied.minute;

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
    console.log('datum: ', newDate);
    console.log('year: ', year);
    console.log('month: ', month);
    console.log('day: ', day);
    console.log('hour: ', hour);
    console.log('minute: ', minute);
  }

  attributes.newQuery = newQuery;
  if (newTime) {
    newDate = newDate.set({hour: newTime.hour(), minute: newTime.minute()});
    hasTime = true;
  }
  attributes.due_date = newDate;
  attributes.pomo_estimate = Number(pomo_estimate);
  attributes.hasTime = hasTime;
  attributes.recurring = repeat_every ? Number(repeat_every) : null;
  attributes.newQuery = attributes.newQuery.trim();

  return attributes;
}

module.exports = carinaParser;
