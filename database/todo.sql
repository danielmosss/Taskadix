drop database if exists tododashboard;
create database tododashboard;

use tododashboard;

drop table if exists todos;

create table todos (
    id int not null auto_increment,
    title varchar(255) not null,
    description varchar(255) not null,
    date date not null,
    todoOrder int not null,
    primary key (id)
);

-- create an stored procedure to insert a todo and automatically set the order to the count of the todos for that date + 1
drop procedure if exists insertAtodoTask;
DELIMITER $$
CREATE PROCEDURE insertAtodoTask (IN title VARCHAR(255), IN description VARCHAR(255), IN insertDate DATE)
BEGIN
    DECLARE todoOrder INT;
    SELECT COUNT(*) INTO todoOrder FROM todos WHERE date = insertDate;
    INSERT INTO todos (title, description, date, todoOrder) VALUES  (title, description, insertDate, todoOrder + 1);
    SELECT LAST_INSERT_ID() as id;
END $$
DELIMITER ;