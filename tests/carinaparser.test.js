import carinaParser from '../CarinaParser';
import moment from 'moment';

describe('Pomodoro test suite', () => {
  it('Adds a task with 2 pomodoro-hours', () => {
    let res = carinaParser('Study Japanese -p 2');
    expect(res.pomo_estimate).toBe(2);
    expect(res.hasTime).toBe(false);
    expect(res.due_date).toBe(undefined);
    expect(res.newQuery).toBe('Study Japanese');
  });
});

describe('Repeater test suite', () => {
  it('Drink water td -r 1', () => {
    let res = carinaParser('Drink water today -r 1');
    expect(res.pomo_estimate).toBe(0);
    expect(res.hasTime).toBe(false);
    expect(moment(res.due_date).date()).toBe(moment().date());
    expect(res.recurring).toBe(1);
    expect(res.newQuery).toBe('Drink water');
  });
  it('Drink water every day', () => {
    let res = carinaParser('Drink water every day');
    expect(res.newQuery).toBe('Drink water');
    expect(res.recurring).toBe(1);
  });
  it('Drink water daily', () => {
    let res = carinaParser('Drink water daily');
    expect(res.newQuery).toBe('Drink water');
    expect(res.recurring).toBe(1);
  });
});

describe('Date test suite', () => {
  it('Adds a task today', () => {
    let res = carinaParser('Study Japanese today');
    expect(moment(res.due_date).date()).toBe(moment().date());
  });

  it('Adds a task tomorrow', () => {
    let res = carinaParser('Study Japanese tomorrow');
    expect(moment(res.due_date).date()).toBe(moment.utc().add(1, 'days').date());
  });

  it('Adds a task in 59 days', () => {
    let res = carinaParser('Study Japanese in 59 days');
    expect(moment(res.due_date).date()).toBe(moment().add(59, 'days').date());
    expect(res.newQuery).toBe('Study Japanese');
  });
  test('Buy flowers 7 may', () => {
    let res = carinaParser('Buy flowers 7 may');
    expect(moment(res.due_date).date()).toBe(7);
    expect(moment(res.due_date).month()).toBe(4);
    expect(res.newQuery).toBe('Buy flowers');
  });

  it('Buy flowers 7th may', () => {
    let res = carinaParser('Buy flowers 7th may');
    expect(moment(res.due_date).date()).toBe(7);
    expect(res.newQuery).toBe('Buy flowers');
    expect(moment(res.due_date).month()).toBe(4);
  });

  it('Buy flowers the 7th of May', () => {
    let res = carinaParser('Buy flowers the 7th of May');
    expect(moment(res.due_date).date()).toBe(7);
    expect(res.newQuery).toBe('Buy flowers');
    expect(moment(res.due_date).month()).toBe(4);
  });

  it('Buy flowers on the 7th of May', () => {
    let res = carinaParser('Buy flowers on the 7th of May');
    expect(moment(res.due_date).date()).toBe(7);
    expect(res.newQuery).toBe('Buy flowers');
    expect(moment(res.due_date).month()).toBe(4);
  });

  it('Buy flowers on 7th of may', () => {
    let res = carinaParser('Buy flowers on 7th of may');
    expect(moment(res.due_date).date()).toBe(7);
    expect(res.newQuery).toBe('Buy flowers');
    expect(moment(res.due_date).month()).toBe(4);
  });

  it('Repair car on friday', () => {
    let res = carinaParser('Repair car on friday');
    expect(res.newQuery).toBe('Repair car');
    expect(moment(res.due_date).isoWeekday()).toBe(5);
  });
  it('Repair car next year', () => {
    let res = carinaParser('Repair car next year');
    expect(res.newQuery).toBe('Repair car');
    expect(moment(res.due_date).year()).toBe(moment().year() + 1);
  });

  it('Meet Rina for a date 19:00', () => {
    let res = carinaParser('Meet Rina for a date 19:00');
    expect(res.newQuery).toBe('Meet Rina for a date');
    expect(moment(res.due_date).date()).toBe(moment().date());
    expect(moment(res.due_date).hour()).toBe(19);
    expect(moment(res.due_date).minute()).toBe(0);
  });
  it('Meet Rina for a date 19:30', () => {
    let res = carinaParser('Meet Rina for a date 19:30');
    expect(res.newQuery).toBe('Meet Rina for a date');
    expect(moment(res.due_date).date()).toBe(moment().date());
    expect(moment(res.due_date).hour()).toBe(19);
    expect(moment(res.due_date).minute()).toBe(30);
  });
  it('Meet Rina for a date 7pm', () => {
    let res = carinaParser('Meet Rina for a date 7pm');
    expect(res.newQuery).toBe('Meet Rina for a date');
    expect(moment(res.due_date).date()).toBe(moment().date());
    expect(moment(res.due_date).hour()).toBe(19);
    expect(moment(res.due_date).minute()).toBe(0);
  });
  it('Meet Rina for a date 7.30pm', () => {
    let res = carinaParser('Meet Rina for a date 7.30pm');
    expect(res.newQuery).toBe('Meet Rina for a date');
    expect(moment(res.due_date).date()).toBe(moment().date());
    expect(moment(res.due_date).hour()).toBe(19);
    expect(moment(res.due_date).minute()).toBe(30);
  });
  it("Meet Rina at 7 o'clock", () => {
    let res = carinaParser("Meet Rina at 7 o'clock");
    expect(res.newQuery).toBe('Meet Rina');
    expect(moment(res.due_date).date()).toBe(moment().date());
    expect(moment(res.due_date).hour()).toBe(7);
    expect(moment(res.due_date).minute()).toBe(0);
  });
});
describe('Multiple attributes', () => {
  test('Buy snus today 13:30 -p 1 -r 1', () => {
    let res = carinaParser('Buy snus today 13:30 -p 1 -r 2');
    expect(res.newQuery).toBe('Buy snus');
    expect(moment(res.due_date).date()).toBe(moment().date());
    expect(moment(res.due_date).hour()).toBe(13);
    expect(moment(res.due_date).minute()).toBe(30);
    expect(res.pomo_estimate).toBe(1);
    expect(res.recurring).toBe(2);
  });
  test('Buy snus 30 January 2pm -p 10 -r 3', () => {
    let res = carinaParser('Buy snus 30 January 2pm -p 10 -r 3');
    expect(res.newQuery).toBe('Buy snus');
    expect(moment(res.due_date).month()).toBe(0);
    expect(moment(res.due_date).date()).toBe(30);
    expect(moment(res.due_date).hour()).toBe(14);
    expect(moment(res.due_date).minute()).toBe(0);
    expect(res.pomo_estimate).toBe(10);
    expect(res.recurring).toBe(3);
  });
  test('Study Japanese -p 3 daily 1st Jan 14:15', () => {
    let res = carinaParser('Study Japanese -p 3 daily 1st Jan 14:15');
    expect(res.newQuery).toBe('Study Japanese');
    expect(moment(res.due_date).month()).toBe(0);
    expect(moment(res.due_date).date()).toBe(1);
    expect(moment(res.due_date).hour()).toBe(14);
    expect(moment(res.due_date).minute()).toBe(15);
    expect(res.pomo_estimate).toBe(3);
    expect(res.recurring).toBe(1);
  });
});
