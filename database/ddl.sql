drop database if exists carina;
create database carina;
use carina;

drop table if exists users;
create table users (
	id int NOT NULL AUTO_INCREMENT,
    user_id VARCHAR(124),
    email VARCHAR(124),
    fullname VARCHAR(124),
    secret VARCHAR(124),
    PRIMARY KEY (id)
);

DROP TABLE IF EXISTS settings;
CREATE TABLE settings (
	id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    pomo_goal INT DEFAULT 0,
    PRIMARY KEY (id),
    FOREIGN KEY(user_id) REFERENCES users(id)
);

drop table if exists lists;
create table lists (
	id int NOT NULL AUTO_INCREMENT,
    user_id int NOT NULL,
    title VARCHAR(64), 
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);


drop table if exists todos;
create table todos (
	id int NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    list_id INT DEFAULT NULL,
    title varchar(512) NOT NULL,
    note varchar(1024),
    due_date DATETIME DEFAULT NULL, 
	has_time BOOL DEFAULT NULL,
    pomo_estimate int, 
    pomo_done int,
    priority INT,
    state INT,
    recurring INT DEFAULT NULL,
    created DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed DATETIME DEFAULT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (list_id) REFERENCES lists(id)
);

drop table if exists sub_tasks;
create table sub_tasks (
	id int NOT NULL AUTO_INCREMENT,
    todo_id INT NOT NULL,
    title VARCHAR(128),
    state INT,
    PRIMARY KEY (id),
    FOREIGN KEY (todo_id) REFERENCES todos(id)
);

DROP TABLE IF EXISTS shared_lists;
CREATE TABLE shared_lists (
	id INT NOT NULL AUTO_INCREMENT,
    list_id INT NOT NULL,
    shared_with INT NOT NULL,
    owner_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (list_id) REFERENCES lists(id),
    FOREIGN KEY (shared_with) REFERENCES users(id),
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

DROP TABLE IF EXISTS pomodoros_done;
CREATE TABLE pomodoros_done (
	id INT NOT NULL AUTO_INCREMENT, 
    user_id INT NOT NULL,
    todo_id INT NOT NULL, 
    completed DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id), 
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (todo_id) REFERENCES todos(id)
);




-- ---------------------------------------------------------------------------------------------------------------- procedures -------------------------------------------------------------------------------------------------------------------------




DROP procedure IF EXISTS  addUser;
DELIMITER //
CREATE PROCEDURE addUser(
	IN u_id VARCHAR(124),
    IN u_email VARCHAR(124),
    IN u_name VARCHAR(124)
)
BEGIN
	INSERT INTO users (user_id, email, fullname)
SELECT * FROM  (SELECT u_id, u_email, u_name) AS tmp
WHERE NOT EXISTS (
    SELECT * FROM users WHERE email = u_email
) LIMIT 1;
END //
DELIMITER ;

DROP procedure IF EXISTS  addSubTask;
DELIMITER //
CREATE PROCEDURE addSubTask(
	IN aTodoId INT,
    IN aTitle VARCHAR(124)
)
BEGIN
	INSERT INTO sub_tasks (todo_id, title, state)
VALUES (aTodoId, aTitle, 0);
END //
DELIMITER ;

DROP procedure IF EXISTS  deleteSubTask;
DELIMITER //
CREATE PROCEDURE deleteSubTask(
	IN aId INT
)
BEGIN
	DELETE FROM sub_tasks WHERE id=aId;
END //
DELIMITER ;

DROP procedure IF EXISTS  editSubTask;
DELIMITER //
CREATE PROCEDURE editSubTask(
	IN aId INT,
    IN aTitle VARCHAR(124),
    IN aState INT
)
BEGIN
	UPDATE sub_tasks SET title=aTitle, state=aState WHERE id=aId;
END //
DELIMITER ;

DROP procedure IF EXISTS  getSubTasks;
DELIMITER //
CREATE PROCEDURE getSubTasks(
	IN aTodoId VARCHAR(124)
)
BEGIN
	SELECT * FROM sub_tasks WHERE todo_id=aTodoId;
END //
DELIMITER ;

DROP procedure IF EXISTS  shareList;
DELIMITER //
CREATE PROCEDURE shareList(
	IN list_id VARCHAR(124),
    IN u_email VARCHAR(124),
    IN ownerId INT
)
BEGIN
	INSERT INTO shared_lists(list_id, shared_with, owner_id)
	VALUES (list_id, (SELECT id FROM users WHERE email=u_email), ownerId);
    CALL getSharedWith(list_id);
END //
DELIMITER ;

DROP procedure IF EXISTS  updateList;
DELIMITER //
CREATE PROCEDURE updateList(
	IN aListId VARCHAR(124),
    IN aTitle VARCHAR(124)
)
BEGIN
	UPDATE lists SET title=aTitle WHERE id=aListId;
END //
DELIMITER ;


DROP procedure IF EXISTS  removeList;
DELIMITER //
CREATE PROCEDURE removeList(
	IN listId INT
)
BEGIN
	UPDATE todos SET state=2 WHERE list_id=listId;
    UPDATE todos SET list_id=null WHERE list_id=listId;
	DELETE FROM shared_lists WHERE list_id=listId;
	DELETE FROM lists WHERE id = listId;
END //
DELIMITER ;

DROP procedure IF EXISTS  addTodo;
DELIMITER //
CREATE PROCEDURE addTodo(
	IN userId INT, 
    IN listId INT, 
    IN todo_title VARCHAR(64), 
    IN pNote VARCHAR(1024),
    IN dueDate DATETIME, 
    IN hasTime BOOL, 
    IN pomoEstimate INT,
    IN recurr INT
)
BEGIN
	INSERT INTO todos (user_id, list_id, title, note, due_date, has_time, pomo_estimate, state, pomo_done, recurring)
        VALUES (userId, listId, todo_title,pNote, dueDate, hasTime,pomoEstimate, 0, 0, recurr);
	SELECT * FROM todos WHERE user_id = userId OR 
      list_id IN (SELECT list_id FROM shared_lists WHERE shared_with=userId)
      OR list_id in (SELECT id FROM lists WHERE user_id=userId)
       ORDER BY -due_date DESC;
END //
DELIMITER ;
select * from todos;

DROP procedure IF EXISTS  getLists;
DELIMITER //
CREATE PROCEDURE getLists(
	IN userId INT
)
BEGIN
	SELECT *,(SELECT group_concat(fullname) FROM users WHERE users.id=(SELECT shared_with FROM shared_lists WHERE shared_lists.shared_with = users.id AND userId = shared_lists.owner_id AND shared_lists.list_id = lists.id)) as sharedWith FROM lists WHERE user_id=userId OR id IN (SELECT list_id FROM shared_lists WHERE shared_with=userId);
END //
DELIMITER ;


DROP PROCEDURE IF EXISTS incPomo;
DELIMITER //
CREATE PROCEDURE incPomo(
	IN userId INT, 
    IN todoId INT
)
BEGIN
	INSERT INTO pomodoros_done (user_id, todo_id)
        VALUES (userId, todoId);
	UPDATE todos
    SET pomo_done = pomo_done +1
    WHERE 
      id = todoId;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS getPomosToday;
DELIMITER //
CREATE PROCEDURE getPomosToday(
    IN aUserId INTEGER
)
BEGIN
    SELECT (SELECT title FROM todos WHERE todos.id=pomodoros_done.todo_id) as task,pomodoros_done.completed 
    FROM pomodoros_done 
    WHERE completed >= CURDATE() && completed < (CURDATE() + INTERVAL 1 DAY);
END //
DELIMITER ;

call getPomosToday(1);

DROP PROCEDURE IF EXISTS createUser;
DELIMITER //
CREATE PROCEDURE createUser(
	IN aUserId VARCHAR(124),
    IN aEmail VARCHAR(124),
    IN aFullname VARCHAR(124),
    IN aSecret VARCHAR(124)
)
BEGIN
	INSERT INTO users (user_id, email, fullname, secret)
        VALUES (aUserId, aEmail,aFullname, aSecret);
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS signIn;
DELIMITER //
CREATE PROCEDURE signIn(
	IN aEmail VARCHAR(124)
)
BEGIN
	IF EXISTS(SELECT * FROM users WHERE email=aEmail) 
    THEN
		SELECT id, secret,email, fullname FROM users WHERE email=aEmail;
    END IF;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS getSharedWith;
DELIMITER //
CREATE PROCEDURE getSharedWith(
	IN aListId INTEGER
)
BEGIN
    SELECT email, id, fullname FROM users WHERE id IN (select shared_with from shared_lists where list_id=aListId);
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS stopSharingList;
DELIMITER //
CREATE PROCEDURE stopSharingList(
	IN aListId INTEGER, 
    IN aUserId INTEGER
)
BEGIN
    DELETE FROM shared_lists WHERE list_id=aListId AND shared_with=aUserId;
    CALL getSharedWith(aListId);
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS emptyTrash;
DELIMITER //
CREATE PROCEDURE emptyTrash(
    IN aUserId INTEGER
)
BEGIN
DELETE FROM sub_tasks WHERE todo_id IN (SELECT id FROM todos WHERE user_id=aUserId AND state=2);
    DELETE FROM todos WHERE user_id=aUserId AND state=2;
END //
DELIMITER ;
;
