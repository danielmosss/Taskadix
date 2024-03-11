create table appointment_category
(
    id    int auto_increment primary key,
    term  varchar(255) NOT NULL,
    color varchar(255) NOT NULL
);

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
    categoryid  int,
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