const request = require('supertest');
const app = require('../app.js');
import moment from 'moment';

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
  test('Should add a todo', done => {
    request(app)
      .post(`/api/todo`)
      .send({
        query: 'Watch drama tomorrow 13:30 -p 2',
        user_id: 1,
        list_id: null,
      })
      .then(response => {
        expect(response.statusCode).toBe(200);
        let todo = response.body[0][0];
        console.log(todo);
        expect(todo.title).toBe('Watch drama');
        expect(todo.note).toBe(null);
        expect(todo.has_time).toBe(1);
        expect(moment(todo.due_date).date() - moment().date()).toBe(1);
        expect(moment(todo.due_date).hour()).toBe(13);
        expect(moment(todo.due_date).minute()).toBe(30);
        expect(todo.pomo_estimate).toBe(2);
        done();
      });
  });
});
