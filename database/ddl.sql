drop database if exists carina;
create database carina;
use carina;
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'rootpass';	
drop table if exists users;
create table users (
	id int NOT NULL AUTO_INCREMENT,
    user_id VARCHAR(124),
    email VARCHAR(124),
    fullname VARCHAR(124),
    secret VARCHAR(124),
    PRIMARY KEY (id), 
    UNIQUE KEY (email)
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

DROP TABLE IF EXISTS password_resets;
CREATE TABLE password_resets (
	id INT NOT NULL AUTO_INCREMENT, 
    state INT NOT NULL,
    user_id INT NOT NULL,
    confirmation_code VARCHAR(16),
    updated DATETIME,
	PRIMARY KEY (id), 
    FOREIGN KEY (user_id) REFERENCES users(id)
);


select * from users;

-- ---------------------------------------------------------------------------------------------------------------- procedures -------------------------------------------------------------------------------------------------------------------------
-- used for google 
DROP procedure IF EXISTS  addUser;
DELIMITER //
CREATE PROCEDURE addUser(
	IN u_id VARCHAR(124),
    IN u_email VARCHAR(124),
    IN u_name VARCHAR(124),
    IN aSecret VARCHAR(124)
)
BEGIN
	INSERT INTO users (user_id, email, fullname, secret)
SELECT * FROM  (SELECT u_id, u_email, u_name, aSecret) AS tmp
WHERE NOT EXISTS (
    SELECT email FROM users WHERE email = u_email
) LIMIT 1;
IF (SELECT id FROM users WHERE email=u_email) IS NOT NULL THEN
	UPDATE users SET user_id=u_id WHERE email=u_email;
END IF;
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
        SELECT * FROM todos WHERE user_id=userId ORDER BY id DESC LIMIT 1;
END //
DELIMITER ;

DROP procedure IF EXISTS  getTodos;
DELIMITER //
CREATE PROCEDURE getTodos(
	IN userId INT
)
BEGIN
	SELECT *, datediff(due_date, now()) as diff FROM todos WHERE user_id = userId OR 
      list_id IN (SELECT list_id FROM shared_lists WHERE shared_with=userId)
      OR list_id in (SELECT id FROM lists WHERE user_id=userId)
       ORDER BY due_date asc;
END //
DELIMITER ;
select * from todos where id < 10 union select * from todos where id > 10;
call getTodos(1);

DROP procedure IF EXISTS  updateTodo;
DELIMITER //
CREATE PROCEDURE updateTodo(
        IN aId INT,
		IN aListId INT,
        IN aTitle VARCHAR(64),
        IN aNote VARCHAR(1024),
        IN aPomoEstimate INT,
        IN aState INT,
        IN aDue_date DATETIME,
        IN aHasTime BOOL,
        IN aRecurring INT
)
BEGIN
	UPDATE  todos
    SET
      list_id=aListId,
      title=aTitle,
        note=aNote,
        pomo_estimate=aPomoEstimate,
        state=aState,
        due_date=aDue_date,
        has_time=aHasTime,
        recurring=aRecurring
    WHERE 
      id=aId
        ;
        IF aState=1 THEN
			UPDATE todos SET completed=CURRENT_TIMESTAMP WHERE id=aId;
		ELSEIF aState=0 THEN
			UPDATE todos SET completed=NULL WHERE id=aId;
		end if;
END //
DELIMITER ;

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
DELETE FROM pomodoros_done WHERE todo_id IN (SELECT id FROM todos WHERE user_id=aUserId AND state=2);
DELETE FROM sub_tasks WHERE todo_id IN (SELECT id FROM todos WHERE user_id=aUserId AND state=2);
    DELETE FROM todos WHERE user_id=aUserId AND state=2;
END //
DELIMITER ;
;

-- Update todo attributes
DROP PROCEDURE IF EXISTS editTodoTitle;
DELIMITER //
CREATE PROCEDURE editTodoTitle(
    IN aTodoId INTEGER,
    IN newTitle VARCHAR(512)
)
BEGIN
  UPDATE todos SET title=newTitle WHERE id=aTodoId;
  SELECT * FROM todos WHERE id=aTodoId;
END //
DELIMITER ;
;

DROP PROCEDURE IF EXISTS editTodoNote;
DELIMITER //
CREATE PROCEDURE editTodoNote(
    IN aTodoId INTEGER,
    IN newNote VARCHAR(1024)
)
BEGIN
  UPDATE todos SET note=newNote WHERE id=aTodoId;
    SELECT * FROM todos WHERE id=aTodoId;
END //
DELIMITER ;
;

DROP PROCEDURE IF EXISTS editTodoState;
DELIMITER //
CREATE PROCEDURE editTodoState(
    IN aTodoId INTEGER,
    IN newState INTEGER
)
BEGIN

UPDATE todos SET state=newState WHERE id=aTodoId;
IF newState = 1 THEN
	UPDATE todos SET completed=NOW() WHERE id=aTodoId;
END IF;
SELECT * FROM todos WHERE id=aTodoId;

END //
DELIMITER ;
;

DROP PROCEDURE IF EXISTS editTodoPomoEstimate;
DELIMITER //
CREATE PROCEDURE editTodoPomoEstimate(
    IN aTodoId INTEGER,
    IN newEstimate INTEGER
)
BEGIN
  UPDATE todos SET pomo_estimate=newEstimate WHERE id=aTodoId;
  SELECT * FROM todos WHERE id=aTodoId;
  
END //
DELIMITER ;
;

DROP PROCEDURE IF EXISTS editTodoDate;
DELIMITER //
CREATE PROCEDURE editTodoDate(
    IN aTodoId INTEGER,
    IN newDate DATETIME
)
BEGIN
IF (SELECT due_date from todos WHERE id=aTodoId) is null THEN
	UPDATE todos SET due_date=newDate WHERE id=aTodoId;
ELSE
  UPDATE todos SET due_date=due_date + INTERVAL DATEDIFF(newDate, due_date) DAY
 WHERE id=aTodoId;
   SELECT * FROM todos WHERE id=aTodoId;
END IF;
END //
DELIMITER ;
;

DROP PROCEDURE IF EXISTS editTodoTime;
DELIMITER //
CREATE PROCEDURE editTodoTime(
    IN aTodoId INTEGER,
    IN newTime VARCHAR(20)
)
BEGIN
  UPDATE todos 
  SET 
   due_date = concat(date(due_date),TIME_FORMAT(newTime, ' %H:%i'))
 WHERE id=aTodoId;
 UPDATE todos SET has_time = TRUE WHERE  id=aTodoId;
   SELECT * FROM todos WHERE id=aTodoId;

END //
DELIMITER ;
;

DROP PROCEDURE IF EXISTS editTodoRecurring;
DELIMITER //
CREATE PROCEDURE editTodoRecurring(
    IN aTodoId INTEGER,
    IN newRecurring INTEGER
)
BEGIN
  UPDATE todos 
  SET 
   recurring = newRecurring
 WHERE id=aTodoId;
   SELECT * FROM todos WHERE id=aTodoId;
END //
DELIMITER ;
;

DROP PROCEDURE IF EXISTS editTodosList;
DELIMITER //
CREATE PROCEDURE editTodosList(
    IN aTodoId INTEGER,
    IN aListId INTEGER
)
BEGIN
  UPDATE todos 
  SET 
   list_id = aListId
 WHERE id=aTodoId;
   SELECT * FROM todos WHERE id=aTodoId;

END //
DELIMITER ;
;

DROP PROCEDURE IF EXISTS beginResetPassword;
DELIMITER //
CREATE PROCEDURE beginResetPassword(
    IN aEmail VARCHAR(64),
    IN aConfirmationCode VARCHAR(16)
)
BEGIN
	DELETE FROM password_resets WHERE user_id=(SELECT id FROM users WHERE email=aEmail) AND state=0;
	INSERT INTO password_resets (state ,user_id, confirmation_code)
	VALUES (0, (SELECT id FROM users WHERE email=aEmail), aConfirmationCode);
END //
DELIMITER ;
;

DROP PROCEDURE IF EXISTS confirmResetPassword;
DELIMITER //
CREATE PROCEDURE confirmResetPassword(
    IN aEmail VARCHAR(64),
    IN aConfirmationCode VARCHAR(16),
    IN aNewPassword VARCHAR(124)
)
BEGIN
IF (SELECT confirmation_code FROM password_resets WHERE user_id=(SELECT id FROM users WHERE email=aEmail) AND state=0) = aConfirmationCode THEN
	UPDATE users SET secret=aNewPassword WHERE email=aEmail;
    UPDATE password_resets SET state=1 WHERE user_id=(SELECT id FROM users WHERE email=aEmail);
END IF;
END //
DELIMITER ;



