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


-- insert some sample data
call insertAtodoTask('Grocery Shopping', 'Buy groceries for the week', '2023-11-26');
call insertAtodoTask('Book Club Meeting', 'Discuss the latest book with the group', '2023-11-26');
call insertAtodoTask('Yoga Class', 'Attend the morning yoga session at the local gym', '2023-11-27');
call insertAtodoTask('Client Follow-Up', 'Check in with clients regarding their feedback', '2023-11-27');
call insertAtodoTask('Report Submission', 'Submit the monthly financial report', '2023-11-28');
call insertAtodoTask('Team Sync-Up', 'Weekly team meeting to discuss project progress', '2023-11-29');
call insertAtodoTask('Dentist Appointment', 'Routine dental check-up', '2023-11-29');
call insertAtodoTask('Car Service', 'Take the car to the dealership for scheduled maintenance', '2023-11-30');
call insertAtodoTask('Parent-Teacher Conference', 'Meet with the kids’ teachers to discuss academic performance', '2023-11-30');
call insertAtodoTask('Networking Event', 'Attend local business networking event', '2023-12-01');