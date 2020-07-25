var express = require('express');
var router = express.Router();

const db = require('./database/db');

router.get('/api/apitest', (req, res) => {
  let bajs = { msg: 'success' };

  res.send(bajs);
});

router.get('/api/id/:user_id', async (req, res) => {
  try {
    let results = await db.userid(req.params.user_id);
    res.json(results);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.get('/api/todos/:id', async (req, res) => {
  try {
    let results = await db.foruser(req.params.id);
    res.json(results);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.get('/api/todosfromlist/', async (req, res) => {
  try {
    let results = await db.fromlist(req.body.user_id, req.body.list_id);

    res.json(results);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.post('/api/user/', async (req, res) => {
  //res.json('hello mutter')
  try {
    let results = await db.adduser(req.body.id, req.body.email, req.body.name);
    res.json(results);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.post('/api/todo/', async (req, res) => {
  try {
    let results = await db.addtodo(
      req.body.user_id,
      req.body.list_id,
      req.body.title,
      req.body.note,
      req.body.due_date,
      req.body.has_time,
      req.body.pomo_estimate,
      req.body.recurring
    );
    res.json(results);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.put('/api/todo/', async (req, res) => {
  try {
    console.log(req.body);
    let results = await db.updateTodo(
      req.body.id,
      req.body.list_id,
      req.body.title,
      req.body.note,
      req.body.pomo_estimate,
      req.body.pomo_done,
      req.body.state,
      req.body.due_date,
      req.body.has_time,
      req.body.recurring
    );
    res.json(results);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.get('/api/list/:user_id', async (req, res) => {
  try {
    let results = await db.getLists(req.params.user_id);
    res.json(results);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.post('/api/list/', async (req, res) => {
  try {
    let results = await db.createList(req.body.user_id, req.body.title);
    res.json(results);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.post('/api/shared_list/', async (req, res) => {
  try {
    let results = await db.shareList(req.body.list_id, req.body.shared_with, req.body.owner_id);
    res.json(results);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.put('/api/list/', async (req, res) => {
  try {
    let results = await db.renameList(req.body.list_id, req.body.new_title);
    res.json(results);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.delete('/api/list/:list_id', async (req, res) => {
  try {
    await db.deleteList(req.params.list_id);
    results = await db.setListNull(req.params.list_id);
    res.json(results);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.put('/api/incpomo/', async (req, res) => {
  try {
    let results = await db.incPomo(req.body.user_id, req.body.todo_id);
    res.json(results);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.delete('/api/todo/:todo_id', async (req, res) => {
  try {
    let results = await db.deleteTodo(req.params.todo_id);
    res.json(results);
  } catch {
    console.error(e);
    res.sendStatus(500);
  }
});

module.exports = router;
