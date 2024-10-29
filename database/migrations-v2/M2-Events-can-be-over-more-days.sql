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
    MODIFY enddate date NOT NULL;

alter table appointments
    modify ics_import_id int default(0) NOT NULL;


alter table appointments
    drop constraint if_allday_starttime_endtime_null;

alter table appointments
    add constraint if_allday_starttime_endtime_null
        check ( (`isallday` = 1) or
                ((`starttime` is not null) and (`endtime` is not null)) );

check ((`isallday` = 1) or
               ((`starttime` is not null) and (`endtime` is not null)


