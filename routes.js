const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const moment = require('moment');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const db = require('./database/db');
const carinaParser = require('./CarinaParser');
const dbFormat = 'YYYY-MM-DD HH:mm:ss';

//Authenticate a users token
const authenticateToken = (req, res, next) => {
  //if (process.env.MODE == 'dev') next();
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401); // if there isn't any token

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    req.user = user;
    next(); // pass the execution off to whatever request the client intended
  });
};

//Generate a token for user
const generateAccessToken = username => {
  return jwt.sign(username, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '7d',
  });
};

const dbDate = moment => {
  if (process.env.NODE_ENV !== 'production') {
    return moment.format(dbFormat);
  }
  return moment.toISOString().slice(0, 19).replace('T', ' ');
};

router.get('/api/apitest', (req, res) => {
  let message = {msg: 'success'};

  res.send(message);
});

//get id based on googleid
router.get('/api/id/:user_id', async (req, res) => {
  try {
    let results = await db.userid(req.params.user_id);
    const token = generateAccessToken({googleId: req.params.user_id});
    res.json({result: results, token: token});
  } catch (e) {
    console.error(e);

    res.sendStatus(500);
  }
});

router.get('/api/todos/:id', authenticateToken, async (req, res) => {
  try {
    let results = await db.foruser(req.params.id);
    res.json(results);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.get('/api/todosfromlist/', authenticateToken, async (req, res) => {
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
      if (result) {
        const token = generateAccessToken({email: req.body.email});
        res.json({userInfo: results, token: token});
      } else res.sendStatus(500);
    });
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.post('/api/todo/', authenticateToken, async (req, res) => {
  let parsed = carinaParser(req.body.query);
  try {
    let results = await db.addTodo(
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

router.post('/api/subtask/', authenticateToken, async (req, res) => {
  try {
    let results = db.addSubTask(req.body.todo_id, req.body.title);
    res.json(results);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});
router.put('/api/subtask/', authenticateToken, async (req, res) => {
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

router.delete('/api/subtask/:id', authenticateToken, async (req, res) => {
  try {
    let results = await db.deleteSubTask(req.params.id);
    res.json(results);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.get('/api/subtask/:todo_id', authenticateToken, async (req, res) => {
  try {
    let results = await db.getSubTasks(req.params.todo_id);
    res.json(results);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.post('/api/todocopy/', authenticateToken, async (req, res) => {
  try {
    let results = await db.addTodo(
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

// note used anymore -------------------
router.put('/api/todo/', authenticateToken, async (req, res) => {
  try {
    let results = await db.updateTodo(
      req.body.id,
      req.body.list_id,
      req.body.title,
      req.body.note,
      req.body.pomo_estimate,
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

// ---------------------------------------
router.get('/api/list/:user_id', authenticateToken, async (req, res) => {
  try {
    let results = await db.getLists(req.params.user_id);
    res.json(results);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.get('/api/sharedwith/:list_id', authenticateToken, async (req, res) => {
  try {
    let results = await db.sharedWith(req.params.list_id);
    res.json(results);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.post('/api/list/', authenticateToken, async (req, res) => {
  try {
    let results = await db.createList(req.body.user_id, req.body.title);
    res.json(results);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.put('/api/list/', authenticateToken, async (req, res) => {
  try {
    let results = await db.updateList(req.body.list_id, req.body.title);
    res.json(results);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.post('/api/shared_list/', authenticateToken, async (req, res) => {
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

router.post('/api/stopsharinglist/', authenticateToken, async (req, res) => {
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

router.put('/api/list/', authenticateToken, async (req, res) => {
  try {
    let results = await db.renameList(req.body.list_id, req.body.new_title);
    res.json(results);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.delete('/api/list/:list_id', authenticateToken, async (req, res) => {
  try {
    let results = await db.deleteList(req.params.list_id);
    await db.setListNull(req.params.list_id);
    res.json(results);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.put('/api/incpomo/', authenticateToken, async (req, res) => {
  try {
    let results = await db.incPomo(req.body.user_id, req.body.todo_id);
    res.json(results);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.put('/api/pomotoday/:user_id', authenticateToken, async (req, res) => {
  try {
    let results = await db.getPomosToday(req.params.user_id);
    res.json(results);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.delete('/api/todo/:todo_id', authenticateToken, async (req, res) => {
  try {
    let results = await db.deleteTodo(req.params.todo_id);
    res.json(results);
  } catch {
    console.error(e);
    res.sendStatus(500);
  }
});

router.delete(
  '/api/emptytrash/:user_id',
  authenticateToken,
  async (req, res) => {
    try {
      let results = await db.emptyTrash(req.params.user_id);
      res.json(results);
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  },
);
router.put('/api/todostate/', authenticateToken, async (req, res) => {
  try {
    let results = await db.updateTodoState(req.body.todo_id, req.body.state);
    res.json(results);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.put('/api/todotitle/', authenticateToken, async (req, res) => {
  try {
    let results = await db.updateTodoTitle(req.body.todo_id, req.body.newTitle);
    res.json(results);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.put('/api/todonote/', authenticateToken, async (req, res) => {
  try {
    let results = await db.updateTodoNote(req.body.todo_id, req.body.newNote);
    res.json(results);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.put('/api/todopomoestimate/', authenticateToken, async (req, res) => {
  try {
    let results = await db.updatePomoEstimate(
      req.body.todo_id,
      req.body.newPomoEstimate,
    );
    res.json(results);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.put('/api/tododate/', authenticateToken, async (req, res) => {
  try {
    let results = await db.editTodoDate(req.body.todo_id, req.body.newDate);
    res.json(results);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.put('/api/todotime/', authenticateToken, async (req, res) => {
  try {
    let results = await db.editTodoTime(req.body.todo_id, req.body.newTime);
    res.json(results);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.put('/api/todorecurring/', authenticateToken, async (req, res) => {
  try {
    console.log(req.body.todo_id, req.body.newRecurring);
    let results = await db.editTodoRecurring(
      req.body.todo_id,
      req.body.newRecurring,
    );
    res.json(results);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

//Update which list todo belongs in
router.put('/api/todoslist/', authenticateToken, async (req, res) => {
  try {
    let results = await db.editTodosList(
      req.body.todo_id,
      req.body.list_id,
    );
    res.json(results);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

module.exports = router;
