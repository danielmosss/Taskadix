CREATE TABLE ics_imports
(
    id                 INT AUTO_INCREMENT PRIMARY KEY,
    user_id            INT          NOT NULL,
    ics_url            VARCHAR(255) NOT NULL,
    last_imported_at   DATETIME,
    created_at         DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at         DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ics_last_synced_at TIMESTAMP,
    category_id        INT,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (category_id) REFERENCES appointment_category (id),
    CONSTRAINT UQ_ics_url UNIQUE (ics_url),
    CONSTRAINT UQ_ics_url_user_id UNIQUE (ics_url, user_id),
    CONSTRAINT CK_ics_imports_user_id CHECK (user_id <= 10)
);

INSERT INTO ics_imports (user_id, ics_url, last_imported_at, created_at, updated_at, ics_last_synced_at)
SELECT id, webcallurl, null, now(), now(), webcalllastsynced
FROM users
where webcallurl is not null;

alter table appointments add column ics_import_id int;
update appointments set ics_import_id = (select id from ics_imports where user_id = appointments.userid limit 1);

alter table appointments drop column iswebcall;


