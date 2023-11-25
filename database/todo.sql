create database tododashboard;

use tododashboard;

create table todos (
    id int not null auto_increment,
    title varchar(255) not null,
    description varchar(255) not null,
    date date not null,
    primary key (id)
);

INSERT INTO todos (title, description, date) VALUES ('Grocery Shopping', 'Buy groceries for the week', '2023-11-26');
INSERT INTO todos (title, description, date) VALUES ('Book Club Meeting', 'Discuss the latest book with the group', '2023-11-26');
INSERT INTO todos (title, description, date) VALUES ('Yoga Class', 'Attend the morning yoga session at the local gym', '2023-11-27');
INSERT INTO todos (title, description, date) VALUES ('Client Follow-Up', 'Check in with clients regarding their feedback', '2023-11-27');
INSERT INTO todos (title, description, date) VALUES ('Report Submission', 'Submit the monthly financial report', '2023-11-28');
INSERT INTO todos (title, description, date) VALUES ('Team Sync-Up', 'Weekly team meeting to discuss project progress', '2023-11-29');
INSERT INTO todos (title, description, date) VALUES ('Dentist Appointment', 'Routine dental check-up', '2023-11-29');
INSERT INTO todos (title, description, date) VALUES ('Car Service', 'Take the car to the dealership for scheduled maintenance', '2023-11-30');
INSERT INTO todos (title, description, date) VALUES ('Parent-Teacher Conference', 'Meet with the kids’ teachers to discuss academic performance', '2023-11-30');
INSERT INTO todos (title, description, date) VALUES ('Networking Event', 'Attend local business networking event', '2023-12-01');

