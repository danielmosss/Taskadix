alter table appointments
    drop column iswebcall;


alter table appointments
    add column enddate date;

#set for every row the enddate to the same as the startdate
update appointments
    set enddate = date;

# set constraint that enddate must be the same or later than startdate
alter table appointments
    add constraint enddate_must_be_later_than_startdate check (enddate >= date);

# enddate can not be null
ALTER TABLE appointments
    MODIFY enddate DATETIME NOT NULL;


