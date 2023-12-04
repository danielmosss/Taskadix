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
    isCHEagenda boolean default false,
    primary key (id)
);

drop procedure if exists insertAtodoTask;
DELIMITER $$
CREATE PROCEDURE insertAtodoTask (IN title VARCHAR(255), IN description VARCHAR(255), IN insertDate DATE, IN isCHEAgenda BOOLEAN)
BEGIN
    DECLARE todoOrder INT;
    DECLARE isCHEAgendaCheck BOOLEAN DEFAULT false;
    IF isCHEAgenda IS NOT NULL THEN
        SET isCHEAgendaCheck = isCHEAgenda;
    END IF;
    SELECT COUNT(*) INTO todoOrder FROM todos WHERE date = insertDate;
    INSERT INTO todos (title, description, date, todoOrder, isCHEAgenda) VALUES  (title, description, insertDate, todoOrder + 1, isCHEAgendaCheck);
    SELECT LAST_INSERT_ID() as id;
END $$
DELIMITER ;

drop table if exists irrelevantAgendaTodos;
create table irrelevantAgendaTodos (
    id int not null auto_increment,
    todoId int not null,
    primary key (id),
    constraint fk_todoId foreign key (todoId) references todos(id) on delete cascade,
    constraint uq_todoId unique (todoId)
);

drop procedure if exists insertAnIrrelevantAgendaTodo;
DELIMITER $$
CREATE PROCEDURE insertAnIrrelevantAgendaTodo (IN todoId INT)
BEGIN
    DECLARE isCHEAgendaBool BOOLEAN;
    SELECT isCHEAgenda INTO isCHEAgendaBool FROM todos WHERE id = todoId;
    IF isCHEAgendaBool = 1 THEN
        INSERT INTO irrelevantagendatodos (todoId) VALUES (todoId);
        SELECT last_insert_id() as id;
    END IF;
END $$
DELIMITER ;


create table users (
    id int not null auto_increment,
    username varchar(255) not null,
    password varchar(255) not null,
    primary key (id),
    constraint uq_username unique (username)
);

alter table todos add column userId int;