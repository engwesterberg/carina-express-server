const mysql = require('mysql');

const pool =
  process.env.NODE_ENV === 'production'
    ? mysql.createPool({
        connectionLimit: 10,
        host: '35.228.149.81',
        user: 'erik',
        password: 'harrot92',
        database: 'carina',
        port: 3306,
      })
    : mysql.createPool({
        connectionLimit: 10,
        host: '127.0.0.1',
        user: 'root',
        password: 'harrot92',
        database: 'carina',
        port: 3306,
      });

//timezone: 'UTC-4',
// const pool = mysql.createPool({
//   connectionLimit: 10,
//   host: 'eu-cdbr-west-03.cleardb.net',
//   user: 'b84860968eff20',
//   password: 'a635563c',
//   database: 'heroku_48d7691d0265476',
//   port: 3306,
// });

let carinadb = {};

carinadb.userid = user_id => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT id FROM users WHERE user_id=?`,
      user_id,
      (err, results) => {
        if (err) return reject(err);

        return resolve(results);
      },
    );
  });
};

carinadb.todos = () => {
  return new Promise((resolve, reject) => {
    pool.query(`SELECT * FROM todos`, (err, results) => {
      if (err) return reject(err);

      return resolve(results);
    });
  });
};

carinadb.foruser = user_id => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT * FROM todos WHERE user_id = ? OR 
      list_id IN (SELECT list_id FROM shared_lists WHERE shared_with=?)
      OR list_id in (SELECT id FROM lists WHERE user_id=?)
       ORDER BY -due_date DESC`,
      [user_id, user_id, user_id],
      (err, results) => {
        if (err) return reject(err);

        return resolve(results);
      },
    );
  });
};

carinadb.fromlist = (user_id, list_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT * FROM todos WHERE user_id = ? AND list_id = ? ORDER BY -due_date DESC`,
      [user_id, list_id],
      (err, results) => {
        if (err) return reject(err);

        return resolve(results);
      },
    );
  });
};
//For google user
carinadb.adduser = (id, email, name) => {
  return new Promise((resolve, reject) => {
    pool.query(`call addUser(?, ?, ?)`, [id, email, name], (err, results) => {
      if (err) return reject(err);

      return resolve(results);
    });
  });
};

carinadb.createuser = (userId, email, fullname, secret) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `call createUser(?, ?, ?, ?)`,
      [userId, email, fullname, secret],
      (err, results) => {
        if (err) return reject(err);

        return resolve(results);
      },
    );
  });
};

carinadb.signin = email => {
  return new Promise((resolve, reject) => {
    pool.query(`call signIn(?)`, [email], (err, results) => {
      if (err) return reject(err);

      return resolve(results);
    });
  });
};

carinadb.addtodo = (
  user_id,
  list_id,
  title,
  note,
  due_date,
  has_time,
  pomo_estimate,
  recurring,
) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `call addTodo(?, ?, ?, ?,?, ?, ?,?);`,
      [
        user_id,
        list_id,
        title,
        note,
        due_date,
        has_time,
        pomo_estimate,
        recurring,
      ],
      (err, results) => {
        if (err) return reject(err);

        return resolve(results);
      },
    );
  });
};

carinadb.updateTodo = (
  id,
  list_id,
  title,
  note,
  pomo_estimate,
  pomo_done,
  state,
  due_date,
  has_time,
  recurring,
) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `UPDATE  todos
    SET
      list_id=?,
      title=?,
        note=?,
        pomo_estimate=?,
        pomo_done=?,
        state=?,
        due_date=?,
        has_time=?,
        recurring=?
    WHERE 
      id=?
        ;`,
      [
        list_id,
        title,
        note,
        pomo_estimate,
        pomo_done,
        state,
        due_date,
        has_time,
        recurring,
        id,
      ],
      (err, results) => {
        if (err) return reject(err);
        return resolve(results);
      },
    );
  });
};

carinadb.getLists = user_id => {
  return new Promise((resolve, reject) => {
    pool.query(`call getLists(?);`, [user_id], (err, results) => {
      if (err) return reject(err);
      return resolve(results);
    });
  });
};

carinadb.createList = (user_id, title) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `INSERT INTO lists (user_id, title)
    VALUES (?, ?)`,
      [user_id, title],
      (err, results) => {
        if (err) return reject(err);
        return resolve(results);
      },
    );
  });
};

carinadb.updateList = (list_id, title) => {
  return new Promise((resolve, reject) => {
    pool.query(`CALL updateList(?, ?)`, [list_id, title], (err, results) => {
      if (err) return reject(err);
      return resolve(results);
    });
  });
};

carinadb.shareList = (list_id, shared_with, owner_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `CALL shareList(?,?,?)`,
      [list_id, shared_with, owner_id],
      (err, results) => {
        if (err) return reject(err);
        return resolve(results);
      },
    );
  });
};

carinadb.stopSharingList = (list_id, shared_with) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `CALL stopSharingList(?,?)`,
      [list_id, shared_with],
      (err, results) => {
        if (err) return reject(err);
        return resolve(results);
      },
    );
  });
};

carinadb.sharedWith = list_id => {
  return new Promise((resolve, reject) => {
    pool.query(`CALL getSharedWith(?)`, [list_id], (err, results) => {
      if (err) return reject(err);
      return resolve(results);
    });
  });
};

carinadb.renameList = (list_id, new_title) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `UPDATE lists 
    SET
      title=?
    WHERE
      id=?
        ;`,
      [new_title, list_id],
      (err, results) => {
        if (err) return reject(err);
        return resolve(results);
      },
    );
  });
};

carinadb.deleteList = list_id => {
  return new Promise((resolve, reject) => {
    pool.query(`CALL removeList(?);`, [list_id], (err, results) => {
      if (err) return reject(err);
      return resolve(results);
    });
  });
};

carinadb.setListNull = list_id => {
  return new Promise((resolve, reject) => {
    pool.query(
      `UPDATE todos SET list_id = null WHERE list_id = ?;;`,
      [list_id],
      (err, results) => {
        if (err) return reject(err);
        return resolve(results);
      },
    );
  });
};

carinadb.deleteTodo = todo_id => {
  return new Promise((resolve, reject) => {
    pool.query(
      `UPDATE todos SET state=2 WHERE id=?;`,
      todo_id,
      (err, results) => {
        if (err) return reject(err);

        return resolve(results);
      },
    );
  });
};

carinadb.incPomo = (user_id, todo_id) => {
  return new Promise((resolve, reject) => {
    pool.query(`CALL incPomo(?, ?)`, [user_id, todo_id], (err, results) => {
      if (err) return reject(err);

      return resolve(results);
    });
  });
};

carinadb.getPomosToday = user_id => {
  return new Promise((resolve, reject) => {
    pool.query(`CALL getPomosToday(?)`, [user_id], (err, results) => {
      if (err) return reject(err);

      return resolve(results);
    });
  });
};

module.exports = carinadb;
