use carina;

call createUser(null, 'erikwesterberg92@gmail.com', 'Erik', '$2b$10$7Oa5XIMnrORZmdvzTWigDeZgxLsNkutzBfGPuiQT09LwOSDNLbpu.');
call createUser(null, 'lovechorina@gmail.com', 'Rina', '$2b$10$7Oa5XIMnrORZmdvzTWigDeZgxLsNkutzBfGPuiQT09LwOSDNLbpu.');
call createUser(null, 'erik@gmail.com', 'Erik', '$2b$10$7Oa5XIMnrORZmdvzTWigDeZgxLsNkutzBfGPuiQT09LwOSDNLbpu.');
call createUser(null, 'root@gmail.com', 'Root', '$2b$10$7Oa5XIMnrORZmdvzTWigDeZgxLsNkutzBfGPuiQT09LwOSDNLbpu.');

INSERT INTO lists (user_id, title) 
VALUES  (1, 'Rinas Tasks'), 
(1, 'Study list'), 
(2, 'Hair Salon') ;

-- no date
call addTodo(1, null, 'Boymakutt', 'For 1 hour',null, false, 2,0);
call addTodo(1, null, 'Slavmopp', 'For 1 hour',NULL, false, 2,0);
call addTodo(1, null, 'Terko', 'For 1 hour',null, false, 2,0);
-- yeserday
call addTodo(1, null, 'Boymakutt', 'For 1 hour',NOW() - interval 1 day, false, 2,0);
call addTodo(1, null, 'Slavmopp', 'For 1 hour',NOW() - interval 1 day, false, 2,0);
call addTodo(1, null, 'Terko', 'For 1 hour',NOW() - interval 1 day, false, 2,0);

-- today
call addTodo(1, null, 'Study Japanese', 'For 1 hour',NOW(), false, 2,0);
call addTodo(1, null, 'Study Math', 'For 1 hour',NOW(), false, 2,0);
call addTodo(1, null, 'Wanikani', 'For 1 hour',NOW(), false, 2,0);
call addTodo(1, null, 'Submit resume', 'For 1 hour',NOW(), false, 2,0);
call addTodo(1, null, 'Update CV', 'For 1 hour',NOW(), false, 2,0);
call addTodo(1, null, 'Book car repair appointment', 'For 1 hour',NOW(), false, 2,0);
call addTodo(1, null, 'Order food online', 'For 1 hour',NOW(), false, 2,0);
call addTodo(1, null, 'Workout', 'For 1 hour',NOW(), false, 4,0);
call addTodo(1, 1, 'Study Korean', 'For 1 hour',NOW() + INTERVAL 1 DAY, false, 2,0);

-- tomorrow
call addTodo(1, null, 'Buy that thing', 'For 1 hour',NOW(), false, 2,0);
call addTodo(1, null, 'Buy pizza', 'For 1 hour',NOW() + INTERVAL 1 DAY, false, 2,0);
call addTodo(1, null, 'Call Rina', 'For 1 hour',NOW() + INTERVAL 1 DAY, false, 2,0);
call addTodo(1, null, 'Get at it', 'For 1 hour',NOW() + INTERVAL 1 DAY, false, 2,0);
call addTodo(1, null, 'Submit thesis', 'For 1 hour',NOW() + INTERVAL 1 DAY, false, 0,0);

call addTodo(2, null, 'Study English', 'For 1 hour',NOW()+1, false, 10,0);

call addSubTask(1, 'Grammar');
call addSubTask(1, 'Speaking');
call addSubTask(1, 'Spelling');
call getSubTasks(1);
call deleteSubTask(1);
call getTodos(1);
select * from users;
select * from password_resets;