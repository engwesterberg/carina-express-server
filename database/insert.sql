use carina;

call createUser(null, 'erikwesterberg@gmail.com', 'Erik', '$2b$10$7Oa5XIMnrORZmdvzTWigDeZgxLsNkutzBfGPuiQT09LwOSDNLbpu.');
call createUser(null, 'lovechorina@gmail.com', 'Rina', '$2b$10$7Oa5XIMnrORZmdvzTWigDeZgxLsNkutzBfGPuiQT09LwOSDNLbpu.');
call createUser(null, 'erik@gmail.com', 'Erik', '$2b$10$7Oa5XIMnrORZmdvzTWigDeZgxLsNkutzBfGPuiQT09LwOSDNLbpu.');
call createUser(null, 'root@gmail.com', 'Root', '$2b$10$7Oa5XIMnrORZmdvzTWigDeZgxLsNkutzBfGPuiQT09LwOSDNLbpu.');
select * from users;
select * from todos;
INSERT INTO lists (user_id, title) 
VALUES  (1, 'Rinas Tasks'), 
(1, 'Study list'), 
(2, 'Hair Salon') ;

call addTodo(1, null, 'Study Japanese', 'For 1 hour',NOW(), false, 2,0);
call addTodo(1, null, 'Study Math', 'For 1 hour',NOW(), false, 2,0);
call addTodo(1, null, 'Wanikani', 'For 1 hour',NOW(), false, 2,0);
call addTodo(1, null, 'Submit resume', 'For 1 hour',NOW(), false, 2,0);
call addTodo(1, null, 'Update CV', 'For 1 hour',NOW(), false, 2,0);
call addTodo(1, null, 'Book car repair appointment', 'For 1 hour',NOW(), false, 2,0);
call addTodo(1, null, 'Order food online', 'For 1 hour',NOW(), false, 2,0);
call addTodo(1, null, 'Workout', 'For 1 hour',NOW(), false, 4,0);
call addTodo(1, 1, 'Study Korean', 'For 1 hour',NOW() + INTERVAL 1 DAY, false, 2,0);
call addTodo(1, null, 'Submit thesis', 'For 1 hour',NOW(), false, 0,0);
call addTodo(2, null, 'Study English', 'For 1 hour',NOW()+1, false, 10,0);


call addTodo(1, null, 'Study Japanese', 'For 1 hour',NOW(), false, 2,0);
call addTodo(1, null, 'Study Math', 'For 1 hour',NOW(), false, 2,0);
call addTodo(1, null, 'Wanikani', 'For 1 hour',NOW(), false, 2,0);
call addTodo(1, null, 'Submit resume', 'For 1 hour',NOW(), false, 2,0);
call addTodo(1, null, 'Update CV', 'For 1 hour',NOW(), false, 2,0);
call addTodo(1, null, 'Book car repair appointment', 'For 1 hour',NOW(), false, 2,0);
call addTodo(1, null, 'Order food online', 'For 1 hour',NOW(), false, 2,0);
call addTodo(1, null, 'Workout', 'For 1 hour',NOW(), false, 4,0);
call addTodo(1, 1, 'Study Korean', 'For 1 hour',NOW() + INTERVAL 1 DAY, false, 2,0);
call addTodo(1, null, 'Submit thesis', 'For 1 hour',NOW(), false, 0,0);
call addTodo(2, null, 'Study English', 'For 1 hour',NOW()+1, false, 10,0);

call addSubTask(1, 'Grammar');
call addSubTask(1, 'Speaking');
call addSubTask(1, 'Spelling');
call getSubTasks(1);
call deleteSubTask(1);

select * from users;
select * from sub_tasks;
select * from pomodoros_done;
select * from todos;
call editSubTask(1, "lol", 1);
select * from todos where user_id=1 order by id desc limit 1;
select * from sub_tasks;
select * from lists;
select * from todos;
select * from users;
call editTodoRecurring(1, 20);
select * from users;
select * from todos;
call editTodoDate(23, now());

select * from lists;

-- Study japanese fungerar
-- Study math fungerar inte