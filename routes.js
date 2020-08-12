const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const moment = require('moment');
const saltRounds = 10;
const db = require('./database/db');
const carinaParser = require('./CarinaParser');
const dbFormat = 'YYYY-MM-DD HH:mm:ss';

const dbDate = moment => {
  if (process.env.NODE_ENV !== 'production') {
    return moment.format(dbFormat);
  }
  return moment.toISOString().slice(0, 19).replace('T', ' ');
};

router.get('/api/apitest', (req, res) => {
  let bajs = {msg: 'success'};

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
//google user, needs refactoring
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

router.post('/api/createuser/', async (req, res) => {
  let encrPass;
  bcrypt.genSalt(10, async function (err, salt) {
    bcrypt.hash(req.body.secret, 10, async function (err, hash) {
      encrPass = hash;
      try {
        let results = await db.createuser(
          req.body.user_id,
          req.body.email,
          req.body.fullname,
          encrPass,
        );
        res.json(results);
      } catch (e) {
        console.error(e);
        res.sendStatus(500);
      }
    });
  });
});

router.post('/api/signin/', async (req, res) => {
  try {
    let results = await db.signin(req.body.email);
    bcrypt.compare(req.body.secret, results[0][0].secret, function (
      err,
      result,
    ) {
      if (result) res.json(results);
      else res.sendStatus(500);
    });
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.post('/api/todo/', async (req, res) => {
  let parsed = carinaParser(req.body.query);
  try {
    let results = await db.addtodo(
      req.body.user_id,
      req.body.list_id,
      parsed.newQuery,
      null,
      parsed.due_date && dbDate(moment(parsed.due_date)),
      parsed.hasTime,
      parsed.pomo_estimate,
      parsed.recurring,
    );
    res.json(results);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.post('/api/subtask/', async (req, res) => {
  try {
    let results = db.addSubTask(req.body.todo_id, req.body.title);
    res.json(results);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});
router.put('/api/subtask/', async (req, res) => {
  try {
    let results = db.editSubTask(
      req.body.subtask_id,
      req.body.title,
      req.body.state,
    );
    res.json(results);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.delete('/api/subtask/:id', async (req, res) => {
  try {
    let results = await db.deleteSubTask(req.params.id);
    res.json(results);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.get('/api/subtask/:todo_id', async (req, res) => {
  try {
    let results = await db.getSubTasks(req.params.todo_id);
    res.json(results);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.post('/api/todocopy/', async (req, res) => {
  try {
    let results = await db.addtodo(
      req.body.user_id,
      req.body.list_id,
      req.body.title,
      req.body.note,
      req.body.due_date && dbDate(moment(req.body.due_date)),
      req.body.hasTime,
      req.body.pomo_estimate,
      req.body.recurring,
    );
    res.json(results);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.put('/api/todo/', async (req, res) => {
  try {
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
      req.body.recurring,
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

router.get('/api/sharedwith/:list_id', async (req, res) => {
  try {
    let results = await db.sharedWith(req.params.list_id);
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

router.put('/api/list/', async (req, res) => {
  try {
    let results = await db.updateList(req.body.list_id, req.body.title);
    res.json(results);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.post('/api/shared_list/', async (req, res) => {
  try {
    let results = await db.shareList(
      req.body.list_id,
      req.body.shared_with,
      req.body.owner_id,
    );
    res.json(results);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.post('/api/stopsharinglist/', async (req, res) => {
  try {
    let results = await db.stopSharingList(
      req.body.list_id,
      req.body.shared_with,
    );
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

router.put('/api/pomotoday/:user_id', async (req, res) => {
  try {
    let results = await db.getPomosToday(req.params.user_id);
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
