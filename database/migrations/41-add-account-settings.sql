alter table users
add column webcallurl varchar(255) null;

alter table users
add column webcalllastsynced timestamp null;

alter table users
add column backgroundcolor varchar(50) null;

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
