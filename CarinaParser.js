const moment = require('moment');
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
  console.log('in parser');
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

  today.map(item => {
    if (query.match(RegExp(item, 'i'))) {
      newDate = moment().hours(defaultHour).minutes(0).seconds(0);
      newQuery = newQuery.replace(RegExp(item, 'i'), '');
    }
  });
  //11am -r 1fungerar inte
  tomorrow.map(item => {
    if (query.match(RegExp(item, 'i'))) {
      newDate = moment().add(1, 'd').hours(defaultHour).minutes(59).seconds(0);
      newQuery = newQuery.replace(RegExp(item, 'i'), '');
    }
  });

  days.map(day => {
    if (query.match(RegExp(day, 'i'))) {
      newDate = moment().day(day.charAt(0).toUpperCase() + day.slice(1));
      if (newDate < moment().hours(0)) {
        newDate.add(7, 'days');
      }
      newQuery = newQuery.replace(RegExp(`(on)* ${day}`, 'i'), '');
    }
  });

  everyDay.map(day => {
    temp = query.match(RegExp(day, 'i'));
    if (temp) {
      repeat_every = 1;
      newQuery = newQuery.replace(temp[0], '');
    }
  });

  months.map((month, index) => {
    if (query.match(RegExp(`in ${month}[a-z]*`, 'i'))) {
      temp = String(query.match(`in ${month}`));
      temp = temp.replace('in ', '');
      newDate = moment().month(index).date(1);
      if (index < moment().month()) newDate = newDate.add(1, 'y');
      newQuery = newQuery.replace(RegExp(`in ${month}[a-z]*`, 'i'), '');
    }
  });

  //june 20
  months.map((month, index) => {
    temp = newQuery.match(
      RegExp(
        `(([0-9]+[a-z]{0,2} ${month}[a-z]*)|(${month}[a-z]* [0-9]+[a-z]{0,2}))+`,
        'i',
      ),
    );
    if (temp) {
      console.log('temp:', temp);
      newQuery = newQuery.replace(temp[0], '');
      let day = temp[0].match('[0-9]+');
      newDate = moment().date(day[0]).month(index);
      if (moment().month() > index) newDate.add(1, 'y');
      else if (moment().month() == index && moment().date() > newDate.date())
        newDate.add(1, 'y');
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

  if (query.match(RegExp(inDays, 'i'))) {
    let regmatutt = query.match(RegExp(inDays, 'i'));
    let days = Number(String(regmatutt).match(RegExp('[0-9]+')));
    newDate = moment().add(days, 'd').hour(defaultHour).minute(0);
    newQuery = newQuery.replace(regmatutt, '');
  }

  next.map(time => {
    if (query.match(RegExp(`next ${time}`, 'i'))) {
      switch (time) {
        case 'week':
          newDate = moment().day('Monday');
          if (newDate.date() < moment().date()) newDate.add(7, 'd');
          break;
        case 'month':
          newDate = moment().add(1, 'month').date(1);
          break;
        case 'year':
          newDate = moment().add(1, 'year').month(0).date(1);
          break;
      }
      newQuery = newQuery.replace(query.match(`next ${time}`, 'i'), '');
    }
  });

  times.map((time, index) => {
    let reg = newQuery.match(RegExp(time, 'i'));
    let t = moment();
    console.log('lets go');
    if (reg) {
      if (index === 0) {
        t.hours(reg[0].split(/:|\./)[0]);
        t.minutes(reg[0].split(/:|\./)[1]);
      } else if (index === 1) {
        let hour = Number(reg[0].match('[0-9]+')[0]);
        hour = reg[0].match(RegExp('pm', 'i')) ? hour + 12 : hour;
        t.hours(hour).minutes(0);
      }
      newQuery = newQuery.replace(RegExp(`(at )*${reg[0]}`), '');
      newTime = t;
      newDate = newDate == null ? moment().hours(defaultHour) : newDate;
    }
  });

  //
  attributes.newQuery = newQuery;
  if (newTime) {
    newDate = newDate.set({hour: newTime.hour(), minute: newTime.minute()});
    hasTime = true;
  }
  attributes.due_date = newDate;
  attributes.pomo_estimate = Number(pomo_estimate);
  attributes.hasTime = hasTime;
  attributes.repeat = Number(repeat_every);
  attributes.newQuery = attributes.newQuery.trim();

  console.log(attributes);
  return attributes;
}

module.exports = carinaParser;
