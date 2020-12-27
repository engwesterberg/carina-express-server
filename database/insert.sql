use carina;
SET SQL_SAFE_UPDATES = 0;

call createUser(null, 'erikwesterberg92@gmail.com', 'Erik', '$2b$10$7Oa5XIMnrORZmdvzTWigDeZgxLsNkutzBfGPuiQT09LwOSDNLbpu.');
call createUser(null, 'lovechorina@gmail.com', 'Rina', '$2b$10$7Oa5XIMnrORZmdvzTWigDeZgxLsNkutzBfGPuiQT09LwOSDNLbpu.');
call createUser(null, 'erik@gmail.com', 'Jacob', '$2b$10$7Oa5XIMnrORZmdvzTWigDeZgxLsNkutzBfGPuiQT09LwOSDNLbpu.');
call createUser(null, 'tina@gmail.com', 'Simon', '$2b$10$7Oa5XIMnrORZmdvzTWigDeZgxLsNkutzBfGPuiQT09LwOSDNLbpu.');
call createUser(null, 'alex@gmail.com', 'Navid', '$2b$10$7Oa5XIMnrORZmdvzTWigDeZgxLsNkutzBfGPuiQT09LwOSDNLbpu.');
call createUser(null, 'tom@gmail.com', 'Anton', '$2b$10$7Oa5XIMnrORZmdvzTWigDeZgxLsNkutzBfGPuiQT09LwOSDNLbpu.');
call createUser(null, 'zayumi@gmail.com', 'Zayumi', '$2b$10$7Oa5XIMnrORZmdvzTWigDeZgxLsNkutzBfGPuiQT09LwOSDNLbpu.');

INSERT INTO lists (user_id, title) 
VALUES  (1, 'Group Project'), 
(1, 'Study list'), 
(1, 'Hair Salon') ;
-- no date
call addTodo(1, null, 'Plan trip', null,null, false, 2,0);
call addTodo(1, null, 'Just do it!', 'For 1 hour',NULL, false, 2,0);
call addTodo(1, null, 'Practice Kanji', null,null, false, 2,0);call addTodo(1, null, 'Boymakutt', 'For 1 hour',null, false, 2,0);

-- yeserday
call addTodo(1, null, 'Pay rent', 'For 1 hour',NOW() - interval 1 day, false, 2,0);
call addTodo(1, null, 'Repair the car', null,NOW() - interval 1 day, false, 2,0);

-- today
call addTodo(1, null, 'Study Japanese', 'For 1 hour',NOW(), false, 2,0);
call addTodo(1, null, 'Study Math', null,NOW(), false, 2,0);
call addTodo(1, null, 'Laundry', null,NOW(), false, 2,0);
call addTodo(1, null, 'Submit resume', 'For 1 hour',NOW(), false, 2,0);
call addTodo(1, null, 'Update resume', null,NOW(), false, 2,0);
call addTodo(1, null, 'Order food online', 'For 1 hour',NOW(), false, 2,0);
call addTodo(1, null, 'Workout', 'For 1 hour',NOW(), false, 4,0);


-- tomorrow
call addTodo(1, null, 'Pay for trip to hakone', 'For 1 hour',NOW(), false, 2,0);
call addTodo(1, null, 'Submit Homework', null,NOW() + INTERVAL 1 DAY, false, 2,0);
-- call addTodo(1, null, 'Call Rina', 'For 1 hour',NOW() + INTERVAL 1 DAY, false, 2,0);
-- call addTodo(1, null, 'Get at it', 'For 1 hour',NOW() + INTERVAL 1 DAY, false, 2,0);
-- call addTodo(1, null, 'Submit thesis', 'For 1 hour',NOW() + INTERVAL 1 DAY, false, 0,0);
call addTodo(1, null, 'Study Japanese', null,NOW()+1, false, 10,0);
call addTodo(1, null, 'Prepare Christmas Gifts', null,'2020-12-20 20:00:00', true, 10,0);


-- list todos
call addTodo(1, 1, 'Update Proposal', null,NOW() + interval 10 day, false, 2,0);
call addTodo(1, 1, 'Evaluate if React meets the requirements', null,NOW() + interval 1 day, false, 2,0);
call addTodo(1, 1, 'Create communication channel', null,NOW() + interval 1 day, false, 2,0);


call shareList(1, 'lovechorina@gmail.com',1);
call shareList(1, 'erik@gmail.com', 1);
call shareList(1, 'tina@gmail.com', 1);
call shareList(1, 'alex@gmail.com', 1);
call shareList(1, 'tom@gmail.com', 1);
call shareList(1, 'robin@gmail.com', 1);

call addSubTask(2, 'Reserve plane tickets');
call addSubTask(2, 'Reserve hotel');
call addSubTask(2, 'Buy aquarium tickets');
call addSubTask(2, 'Reserve hotel');
call addSubTask(1, 'Plan each day');
call getSubTasks(1);
call getTodos(1)
 