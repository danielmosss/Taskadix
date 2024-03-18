drop table if exists family_appointments;
drop table if exists appointments;
drop table if exists appointment_category;
create table appointment_category
(
    id    int auto_increment primary key,
    term  varchar(255) NOT NULL,
    color varchar(255) NOT NULL,
    userid int null,
    isdefault tinyint(1) not null,
    FOREIGN KEY (userid) REFERENCES users (id),
    CONSTRAINT isdefaultOrUserid CHECK (isdefault = 1 OR userid IS NOT NULL),
    CONSTRAINT term_unique UNIQUE (term, userid)
);

INSERT INTO appointment_category (term, color, isdefault) VALUES ('Work', '#ff0000', 1);
INSERT INTO appointment_category (term, color, isdefault) VALUES ('Private', '#00ff00', 1);
INSERT INTO appointment_category (term, color, isdefault) VALUES ('Family', '#0000ff', 1);
INSERT INTO appointment_category (term, color, isdefault) VALUES ('School', '#ffff00', 1);

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