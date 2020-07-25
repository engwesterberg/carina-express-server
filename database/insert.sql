use carina;

insert into todos (user_id,title, note,pomo_estimate, pomo_done)
values ("rinacarina2983", "Feed teddy", "Teddy is very hungry", 1, 0);
select * from todos;
INSERT INTO users (user_id) 
  SELECT 5 FROM DUAL
WHERE NOT EXISTS 
  (SELECT user_id FROM users WHERE user_id=5);

select *  from users;
delete from users;
select * from todos order by -due_date desc;
select * from todos;
delete from todos;
select * from lists;
UPDATE todos SET list_id = null WHERE list_id = 32;
delete from lists;
SELECT 
    table_schema 'carina',
    SUM(data_length + index_length) 'Size in Bytes',
    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) 'Size in MiB'
FROM information_schema.tables 
GROUP BY table_schema;


select * from lists;
delete from lists;
update todos set done = 1 where id = 12;
select * from shared_lists;
delete from shared_lists;

INSERT INTO todos (user_id, title)
VALUES ("117115705114101773347", "Teddy muchos hungrios"),
("117115705114101773347", "Give teddy foooooooood");

show create table todos;
DELETE FROM todos WHERE id=1;

UPDATE  todos
SET
	title="Rinapyon",
    note="gotta doit",
    due_date=null,
    pomo_done=0,
    done=1
WHERE 
	id=19
    ;
    
UPDATE lists 
SET
	title="Tjena"
WHERE
	id=1
    ;
    
SELECT * FROM todos WHERE user_id=1 AND list_id=10;

UPDATE todos
SET pomo_done = pomo_done +1
WHERE 
	id = 206;
    
    
select * from shared_lists;
SELECT * FROM todos 
WHERE user_id=2
OR 
list_id IN (SELECT list_id FROM shared_lists WHERE shared_with=2)
;

SELECT * FROM lists WHERE user_id=2 OR id IN (SELECT list_id FROM shared_lists WHERE shared_with=2);

SELECT *, shared_lists.shared_with FROM lists
LEFT JOIN shared_lists
ON lists.id = shared_lists.list_id
WHERE lists.user_id = 2;

SELECT *, ( SELECT GROUP_CONCAT(fullname) FROM users WHERE id=(SELECT shared_with FROM shared_lists WHERE shared_lists.list_id=lists.id)) as shared_with FROM lists WHERE user_id=1 OR id IN (SELECT list_id FROM shared_lists WHERE shared_with=1);
select GROUP_CONCAT(fullname) from users;

select (select GROUP_CONCAT(fullname) FROM users where users.id=shared_lists.shared_with) as sharedWith from shared_lists where shared_lists.list_id=3;

SELECT *, (select GROUP_CONCAT(fullname) FROM users where users.id=shared_lists.shared_with) as sharedWith FROM lists WHERE user_id=1 OR id IN (SELECT list_id FROM shared_lists WHERE shared_with=1);
select GROUP_CONCAT(fullname) from users;

SELECT *,(SELECT group_concat(shared_with) FROM shared_lists WHERE owner_id = lists.user_id) as sharedWith FROM lists WHERE user_id=2 OR id IN (SELECT list_id FROM shared_lists WHERE shared_with=2);


select * from users;
SELECT *,(SELECT group_concat(fullname) FROM users WHERE users.id=(SELECT shared_with FROM shared_lists WHERE shared_lists.shared_with = users.id AND 1 = shared_lists.owner_id AND shared_lists.list_id = lists.id)) as sharedWith FROM lists WHERE user_id=1 OR id IN (SELECT list_id FROM shared_lists WHERE shared_with=1);


SELECT *, (SELECT title FROM LISTS WHERE id = todos.list_id) AS listName FROM todos WHERE user_id = 1 OR 
      list_id IN (SELECT list_id FROM shared_lists WHERE shared_with=1)
      OR list_id in (SELECT id FROM lists WHERE user_id=1)
       ORDER BY -due_date DESC;
       select * from lists;