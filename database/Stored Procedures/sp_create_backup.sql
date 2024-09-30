-- check if sp exist then drop it-- auto-generated definition


DROP PROCEDURE IF EXISTS sp_create_backup;

-- create sp
CREATE PROCEDURE sp_create_backup(IN userid INT)
BEGIN

    SELECT users.id,
           users.username,
           users.email,
           (DATE(now()))                          as TimeCreated,
           (SELECT 2)                             as TemplateV,
           (SELECT JSON_ARRAYAGG(
                           JSON_OBJECT(
                                   'id', todos.id,
                                   'title', todos.title,
                                   'description', todos.description,
                                   'date', todos.date,
                                   'todoOrder', todos.todoOrder,
                                   'isCHEagenda', todos.isCHEagenda,
                                   'userId', todos.userId,
                                   'checked', todos.checked))

            FROM todos
            WHERE userId = userid)              as Todos,
           (SELECT JSON_ARRAYAGG(
                           JSON_OBJECT(
                                   'id', appointments.id,
                                   'userid', appointments.userid,
                                   'title', appointments.title,
                                   'description', appointments.description,
                                   'date', appointments.date,
                                   'isallday', appointments.isallday,
                                   'starttime', appointments.starttime,
                                   'endtime', appointments.endtime,
                                   'location', appointments.location,
                                   'categoryid', appointments.categoryid,
                                   'ics_import_id', appointments.ics_import_id))
            FROM appointments
            WHERE appointments.userid = userid) as Appointments,
           (SELECT JSON_ARRAYAGG(
                           JSON_OBJECT(
                                   'id', ap.id,
                                   'term', ap.term,
                                   'color', ap.color,
                                   'userid', ap.userid,
                                   'isdefault', ap.isdefault))
            FROM appointment_category ap
            WHERE ap.userid = userid
              AND ap.isdefault = 0)               as Categories
    FROM users
    WHERE users.id = userid;

END;

