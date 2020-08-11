use carina;
call createUser(null, 'erikwesterberg92@gmail.com', 'Erik', '$2b$10$7Oa5XIMnrORZmdvzTWigDeZgxLsNkutzBfGPuiQT09LwOSDNLbpu.');
call createUser(null, 'lovechorina@gmail.com', 'Rina', '$2b$10$7Oa5XIMnrORZmdvzTWigDeZgxLsNkutzBfGPuiQT09LwOSDNLbpu.');
call createUser(null, 'erik@gmail.com', 'Erik', '$2b$10$7Oa5XIMnrORZmdvzTWigDeZgxLsNkutzBfGPuiQT09LwOSDNLbpu.');
call createUser(null, 'root@gmail.com', 'Root', '$2b$10$7Oa5XIMnrORZmdvzTWigDeZgxLsNkutzBfGPuiQT09LwOSDNLbpu.');

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

select * from pomodoros_done;
