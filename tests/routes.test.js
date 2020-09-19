const request = require('supertest');
const app = require('../app.js');
import moment from 'moment';

const WANIKANI_ID = 3;

describe('api/apitest', () => {
  test('Should fetch some simple data', done => {
    request(app)
      .get('/api/apitest')
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

//fungerar inte
describe('api/id/:user_id', () => {
  test('Should fetch a user id', done => {
    request(app)
      .get(`/api/id/${1}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('api/todos/:id', () => {
  test('Should fetch todos for a user', done => {
    request(app)
      .get(`/api/todos/${1}`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('api/todosfromlist', () => {
  test('Should fetch all todos from a list', done => {
    request(app)
      .get(`/api/todosfromlist`)
      .send({user_id: 1, list_id: 1})
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('api/signin', () => {
  test('Should sign in successfully', done => {
    request(app)
      .post(`/api/signin`)
      .send({
        email: 'erikwesterberg@gmail.com',
        secret: 'pass',
      })
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('api/todo', () => {
  test('Add a todo', done => {
    request(app)
      .post(`/api/todo`)
      .send({
        query: 'Watch drama tomorrow 13:30 -p 2 every day',
        user_id: 1,
        list_id: null,
      })
      .then(response => {
        expect(response.statusCode).toBe(200);
        let todo = response.body[0][0];
        expect(todo.title).toBe('Watch drama');
        expect(todo.note).toBe(null);
        expect(todo.has_time).toBe(1);
        expect(moment(todo.due_date).date() - moment.utc().date()).toBe(1);
        expect(moment(todo.due_date).hour()).toBe(13);
        expect(moment(todo.due_date).minute()).toBe(30);
        expect(todo.pomo_estimate).toBe(2);
        expect(todo.recurring).toBe(1);
        done();
      });
  });
});

describe('api/todo', () => {
  test('Add a couple of sub tasks', done => {
    request(app)
      .post(`/api/subtask`)
      .send({
        todo_id: 1,
        title: 'Read a book',
      })
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('api/todo', () => {
  test('Edit the title of a subtask', done => {
    request(app)
      .put(`/api/subtask`)
      .send({
        todo_id: 1,
        title: 'Writing',
      })
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('delete - api/todo/:id', () => {
  test('Delete a subtask', done => {
    request(app)
      .delete(`/api/subtask/3`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('get - api/todo/:id', () => {
  test('Delete a subtask', done => {
    request(app)
      .get(`/api/subtask/1`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        let todo = response.body[0];
        done();
      });
  });
});

describe('/api/todocopy/', () => {
  test('Copy a task', done => {
    request(app)
      .post('/api/todocopy/')
      .send({
        user_id: 1,
        list_id: null,
        title: 'Task to be copied',
        note: 'Copied note',
        due_date: '2021-10-5',
        hasTime: false,
        pomo_estimate: 3,
        recurring: 2,
      })
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('/api/list/:user_id', () => {
  test('Get all lists by user', done => {
    request(app)
      .get('/api/list/1')
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('api/sharedwith/:list_id', () => {
  test('Get users who has access to a specific list', done => {
    request(app)
      .get('/api/sharedwith/1')
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('/api/list', () => {
  test('Add a  new list', done => {
    request(app)
      .post('/api/list')
      .send({user_id: 1, title: 'New list'})
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });

  test('Change list name', done => {
    request(app)
      .put('/api/list')
      .send({list_id: 1, title: 'Changed list name'})
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });

  test('Delete a list', done => {
    request(app)
      .delete('/api/list/2')
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('/api/shared_list/', () => {
  test('Share a list', done => {
    request(app)
      .post('/api/shared_list')
      .send({list_id: 1, shared_with: 'lovechorina@gmail.com', owner_id: 1})
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('/api/stopsharinglist/', () => {
  test('Stop sharing a list', done => {
    request(app)
      .post('/api/stopsharinglist/')
      .send({list_id: 1, shared_with: 2})
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('/api/incpomo/', () => {
  test('Count pomodoro up', done => {
    request(app)
      .put('/api/incpomo/')
      .send({user_id: 1, todo_id: 1})
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('/api/pomotoday/:user_id', () => {
  test('Get all pomodoros done today for a user', done => {
    request(app)
      .put('/api/pomotoday/1')
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('/api/todo/:todo_id', () => {
  test('Delete a todo', done => {
    request(app)
      .delete('/api/todo/1')
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe('/api/emptytrash/:user_id', () => {
  test('Empty the trash', done => {
    request(app)
      .delete('/api/emptytrash/1')
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

//--------- updating todo attributes
describe('/api/todotitle/', () => {
  test('Change the title of a todo', done => {
    request(app)
      .put('/api/todotitle/')
      .send({todo_id: WANIKANI_ID, newTitle: 'New todo title'})
      .then(response => {
        let todo = response.body[0][0];
        expect(response.statusCode).toBe(200);
        expect(todo.id).toBe(WANIKANI_ID);
        expect(todo.title).toBe('New todo title');
        done();
      });
  });
});

describe('/api/todonote/', () => {
  test('Change the note of a todo', done => {
    request(app)
      .put('/api/todonote/')
      .send({todo_id: WANIKANI_ID, newNote: 'New note for wanikani'})
      .then(response => {
        let todo = response.body[0][0];
        expect(response.statusCode).toBe(200);
        expect(todo.id).toBe(WANIKANI_ID);
        expect(todo.title).toBe('New todo title');
        expect(todo.note).toBe('New note for wanikani');
        done();
      });
  });
});

describe('/api/todopomoestimate/', () => {
  test('Change the pomoestimate of a todo', done => {
    request(app)
      .put('/api/todopomoestimate/')
      .send({todo_id: WANIKANI_ID, newPomoEstimate: 10})
      .then(response => {
        let todo = response.body[0][0];
        expect(response.statusCode).toBe(200);
        expect(todo.id).toBe(WANIKANI_ID);
        expect(todo.title).toBe('New todo title');
        expect(todo.note).toBe('New note for wanikani');
        expect(todo.pomo_estimate).toBe(10);
        done();
      });
  });
});

describe('/api/tododate/', () => {
  test('Change the date of a todo to 1992-01-16', done => {
    request(app)
      .put('/api/tododate/')
      .send({todo_id: WANIKANI_ID, newDate: '1992-01-16'})
      .then(response => {
        let todo = response.body[0][0];
        let date = moment(response.body[0][0].due_date);
        expect(response.statusCode).toBe(200);
        expect(todo.id).toBe(WANIKANI_ID);
        expect(todo.title).toBe('New todo title');
        expect(todo.note).toBe('New note for wanikani');
        expect(todo.pomo_estimate).toBe(10);
        expect(date.year()).toBe(1992);
        expect(date.month()).toBe(0);
        expect(date.date()).toBe(16);
        done();
      });
  });
  test('Change the date of a todo to 1337-11-30', done => {
    request(app)
      .put('/api/tododate/')
      .send({todo_id: WANIKANI_ID, newDate: '1337-11-30'})
      .then(response => {
        let todo = response.body[0][0];
        let date = moment(response.body[0][0].due_date);
        expect(response.statusCode).toBe(200);
        expect(todo.id).toBe(WANIKANI_ID);
        expect(todo.title).toBe('New todo title');
        expect(todo.note).toBe('New note for wanikani');
        expect(todo.pomo_estimate).toBe(10);
        expect(date.year()).toBe(1337);
        expect(date.month()).toBe(10);
        expect(date.date()).toBe(30);
        done();
      });
  });
});

describe('/api/todotime/', () => {
  test('Change the time of a todo to 18:00', done => {
    request(app)
      .put('/api/todotime/')
      .send({todo_id: WANIKANI_ID, newTime: '18:00'})
      .then(response => {
        let todo = response.body[0][0];
        let date = moment(response.body[0][0].due_date);
        expect(response.statusCode).toBe(200);
        expect(todo.id).toBe(WANIKANI_ID);
        expect(todo.title).toBe('New todo title');
        expect(todo.note).toBe('New note for wanikani');
        expect(date.year()).toBe(1337);
        expect(date.month()).toBe(10);
        expect(date.date()).toBe(30);
        expect(date.hour()).toBe(18);
        expect(date.minute()).toBe(0);
        done();
      });
  });
  test('Change the time of a todo to 13:37', done => {
    request(app)
      .put('/api/todotime/')
      .send({todo_id: WANIKANI_ID, newTime: '13:37'})
      .then(response => {
        let todo = response.body[0][0];
        let date = moment(response.body[0][0].due_date);
        expect(response.statusCode).toBe(200);
        expect(todo.id).toBe(WANIKANI_ID);
        expect(todo.title).toBe('New todo title');
        expect(todo.note).toBe('New note for wanikani');
        expect(date.year()).toBe(1337);
        expect(date.month()).toBe(10);
        expect(date.date()).toBe(30);
        expect(date.hour()).toBe(13);
        expect(date.minute()).toBe(37);
        done();
      });
  });

  test('Change the time of a todo to 00:03', done => {
    request(app)
      .put('/api/todotime/')
      .send({todo_id: WANIKANI_ID, newTime: '00:03'})
      .then(response => {
        let todo = response.body[0][0];
        let date = moment(response.body[0][0].due_date);
        expect(response.statusCode).toBe(200);
        expect(todo.id).toBe(WANIKANI_ID);
        expect(todo.title).toBe('New todo title');
        expect(todo.note).toBe('New note for wanikani');
        expect(date.year()).toBe(1337);
        expect(date.month()).toBe(10);
        expect(date.date()).toBe(30);
        expect(date.hour()).toBe(0);
        expect(date.minute()).toBe(3);
        done();
      });
  });

  test('Change the time of a todo to 12:59', done => {
    request(app)
      .put('/api/todotime/')
      .send({todo_id: WANIKANI_ID, newTime: '12:59'})
      .then(response => {
        let todo = response.body[0][0];
        let date = moment(response.body[0][0].due_date);
        expect(response.statusCode).toBe(200);
        expect(todo.id).toBe(WANIKANI_ID);
        expect(todo.title).toBe('New todo title');
        expect(todo.note).toBe('New note for wanikani');
        expect(date.year()).toBe(1337);
        expect(date.month()).toBe(10);
        expect(date.date()).toBe(30);
        expect(date.hour()).toBe(12);
        expect(date.minute()).toBe(59);
        done();
      });
  });
});

describe('/api/todostate/', () => {
  test('Change the state of a todo', done => {
    request(app)
      .put('/api/todostate/')
      .send({todo_id: WANIKANI_ID, newState: 2})
      .then(response => {
        let todo = response.body[0][0];
        let date = moment(response.body[0][0].due_date);
        expect(response.statusCode).toBe(200);
        expect(todo.id).toBe(WANIKANI_ID);
        expect(todo.state).toBe(2);
        expect(todo.title).toBe('New todo title');
        expect(todo.note).toBe('New note for wanikani');
        expect(date.year()).toBe(1337);
        expect(date.month()).toBe(10);
        expect(date.date()).toBe(30);
        expect(date.hour()).toBe(12);
        expect(date.minute()).toBe(59);
        done();
      });
  });
});

describe('Change multiple times and dates', () => {
  test('18:01', done => {
    request(app)
      .put('/api/todotime/')
      .send({todo_id: WANIKANI_ID, newTime: '18:01'})
      .then(response => {
        let todo = response.body[0][0];
        let date = moment(response.body[0][0].due_date);
        expect(response.statusCode).toBe(200);
        expect(todo.id).toBe(WANIKANI_ID);
        expect(todo.state).toBe(2);
        expect(todo.title).toBe('New todo title');
        expect(todo.note).toBe('New note for wanikani');
        expect(date.year()).toBe(1337);
        expect(date.month()).toBe(10);
        expect(date.date()).toBe(30);
        expect(date.hour()).toBe(18);
        expect(date.minute()).toBe(1);
        done();
      });
  });

  test('2022-1-30', done => {
    request(app)
      .put('/api/tododate/')
      .send({todo_id: WANIKANI_ID, newDate: '2022-1-30'})
      .then(response => {
        let todo = response.body[0][0];
        let date = moment(response.body[0][0].due_date);
        expect(response.statusCode).toBe(200);
        expect(todo.id).toBe(WANIKANI_ID);
        expect(todo.title).toBe('New todo title');
        expect(todo.note).toBe('New note for wanikani');
        expect(todo.pomo_estimate).toBe(10);
        expect(date.year()).toBe(2022);
        expect(date.month()).toBe(0);
        expect(date.date()).toBe(30);
        expect(date.hour()).toBe(18);
        expect(date.minute()).toBe(1);
        done();
      });
  });
});
