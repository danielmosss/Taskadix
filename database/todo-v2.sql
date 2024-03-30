drop database if exists tododashboardv2;
create database tododashboardv2;

use tododashboardv2;

drop table if exists todos;
create table todos (
    id int not null auto_increment,
    title varchar(255) not null,
    description varchar(1000) not null,
    date date not null,
    todoOrder int not null,
    isCHEagenda boolean default false,
    userId int not null,
    checked boolean default false,
    primary key (id)
);

drop procedure if exists insertAtodoTask;
DELIMITER $$
CREATE PROCEDURE insertAtodoTask (IN title VARCHAR(255), IN description VARCHAR(255), IN insertDate DATE, IN isCHEAgenda BOOLEAN, IN user_id INT)
BEGIN
    DECLARE isCHEAgendaCheck BOOLEAN DEFAULT false;
    IF isCHEAgenda IS NOT NULL THEN
        SET isCHEAgendaCheck = isCHEAgenda;
    END IF;

    SET @todoOrder = 0;
    SELECT todoOrder INTO @todoOrder FROM todos WHERE date = insertDate AND userId = 10 order by todoOrder desc limit 1;

    INSERT INTO todos (title, description, date, todoOrder, isCHEAgenda, userId) VALUES  (title, description, insertDate, (@todoOrder + 1), isCHEAgendaCheck, user_id);
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
CREATE PROCEDURE insertAnIrrelevantAgendaTodo (IN todoId INT, IN user_id INT)
BEGIN
    DECLARE isCHEAgendaBool BOOLEAN;
    DECLARE isusersTodo BOOLEAN;
    SELECT isCHEAgenda INTO isCHEAgendaBool FROM todos WHERE id = todoId AND userId = user_id;
    SELECT 1 INTO isusersTodo FROM todos WHERE id = todoId AND userId = user_id;
    IF isCHEAgendaBool = 1 AND isusersTodo = 1 THEN
        INSERT INTO irrelevantagendatodos (todoId) VALUES (todoId);
        SELECT last_insert_id() as id;
    END IF;

    IF isusersTodo = 0 THEN
        select 0 as id;
    END IF;
END $$
DELIMITER ;

create table users (
    id int not null auto_increment,
    username varchar(255) not null,
    password varchar(255) not null,
    email varchar(255) not null,
    webcallurl varchar(255) null,
    webcalllastsynced timestamp null,
    primary key (id),
    constraint uq_username unique (username),
    constraint uq_email unique (email),
    constraint uq_username_email unique (username, email)
);

drop table if exists family_appointments;
drop table if exists appointments;
drop table if exists appointment_category;
create table appointment_category
(
    id    int auto_increment primary key,
    term  varchar(255) NOT NULL,
    color varchar(255) NOT NULL,
    userid int null,
    isdefault tinyint(1) not null default 0,
    FOREIGN KEY (userid) REFERENCES users (id),
    CONSTRAINT isdefaultOrUserid CHECK (isdefault = 1 OR userid IS NOT NULL),
    CONSTRAINT term_unique UNIQUE (term, userid)
);

INSERT INTO appointment_category (term, color, isdefault) VALUES ('Work', '#ff0000', 1);
INSERT INTO appointment_category (term, color, isdefault) VALUES ('Private', '#00ff00', 1);
INSERT INTO appointment_category (term, color, isdefault) VALUES ('Family', '#0000ff', 1);
INSERT INTO appointment_category (term, color, isdefault) VALUES ('School', '#ffff00', 1);
INSERT INTO appointment_category (term, color, isdefault) VALUES ('ICS Import', '#ff00ff', 1);

create table appointments
(
    id          int auto_increment primary key,
    userid      int          NOT NULL,
    title       varchar(255) NOT NULL,
    description text,
    date        date         NOT NULL,
    isallday    tinyint(1)   NOT NULL,
    starttime   time,
    endtime     time,
    location    varchar(255),
    categoryid  int          NOT NULL,
    FOREIGN KEY (userid) REFERENCES users (id),
    FOREIGN KEY (categoryid) REFERENCES appointment_category (id),
    CONSTRAINT title_non_empty CHECK (title <> ''),
    CONSTRAINT if_allday_starttime_endtime_null CHECK (isallday = 1 OR (starttime IS NOT NULL AND endtime IS NOT NULL AND starttime < endtime))
);

create table families
(
    id          int auto_increment primary key,
    name        varchar(255) NOT NULL,
    description text
);

create table family_members
(
    id       int auto_increment primary key,
    familyid int NOT NULL,
    userid   int NOT NULL,
    FOREIGN KEY (familyid) REFERENCES families (id),
    FOREIGN KEY (userid) REFERENCES users (id)
);

create table family_appointments
(
    id            int auto_increment primary key,
    familyid      int NOT NULL,
    appointmentid int NOT NULL,
    FOREIGN KEY (familyid) REFERENCES families (id),
    FOREIGN KEY (appointmentid) REFERENCES appointments(id)
);