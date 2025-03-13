-- --------------------------------------------------------
-- Host:                         localhost
-- Server version:               8.0.36 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for tododashboardv2
CREATE DATABASE IF NOT EXISTS `tododashboardv2` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `tododashboardv2`;

-- Dumping structure for table tododashboardv2.appointments
CREATE TABLE IF NOT EXISTS `appointments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userid` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `date` date NOT NULL,
  `isallday` tinyint(1) NOT NULL,
  `starttime` time DEFAULT NULL,
  `endtime` time DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `categoryid` int NOT NULL,
  `ics_import_id` int NOT NULL DEFAULT (0),
  `enddate` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userid` (`userid`),
  KEY `categoryid` (`categoryid`),
  CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`id`),
  CONSTRAINT `appointments_ibfk_2` FOREIGN KEY (`categoryid`) REFERENCES `appointment_category` (`id`),
  CONSTRAINT `enddate_must_be_later_than_startdate` CHECK ((`enddate` >= `date`)),
  CONSTRAINT `if_allday_starttime_endtime_null` CHECK (((`isallday` = 1) or ((`starttime` is not null) and (`endtime` is not null)))),
  CONSTRAINT `title_non_empty` CHECK ((`title` <> _utf8mb4''))
) ENGINE=InnoDB AUTO_INCREMENT=1797 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table tododashboardv2.appointment_category
CREATE TABLE IF NOT EXISTS `appointment_category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `term` varchar(255) NOT NULL,
  `color` varchar(255) NOT NULL,
  `userid` int DEFAULT NULL,
  `isdefault` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `term_unique` (`term`,`userid`),
  KEY `userid` (`userid`),
  CONSTRAINT `appointment_category_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`id`),
  CONSTRAINT `isdefaultOrUserid` CHECK (((`isdefault` = 1) or (`userid` is not null)))
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table tododashboardv2.families
CREATE TABLE IF NOT EXISTS `families` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table tododashboardv2.family_appointments
CREATE TABLE IF NOT EXISTS `family_appointments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `familyid` int NOT NULL,
  `appointmentid` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `familyid` (`familyid`),
  KEY `appointmentid` (`appointmentid`),
  CONSTRAINT `family_appointments_ibfk_1` FOREIGN KEY (`familyid`) REFERENCES `families` (`id`),
  CONSTRAINT `family_appointments_ibfk_2` FOREIGN KEY (`appointmentid`) REFERENCES `appointments` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table tododashboardv2.family_members
CREATE TABLE IF NOT EXISTS `family_members` (
  `id` int NOT NULL AUTO_INCREMENT,
  `familyid` int NOT NULL,
  `userid` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `familyid` (`familyid`),
  KEY `userid` (`userid`),
  CONSTRAINT `family_members_ibfk_1` FOREIGN KEY (`familyid`) REFERENCES `families` (`id`),
  CONSTRAINT `family_members_ibfk_2` FOREIGN KEY (`userid`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table tododashboardv2.ics_imports
CREATE TABLE IF NOT EXISTS `ics_imports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `ics_url` varchar(255) NOT NULL,
  `last_imported_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ics_last_synced_at` timestamp NULL DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_ics_url_user_id` (`ics_url`,`user_id`),
  KEY `user_id` (`user_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `ics_imports_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `ics_imports_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `appointment_category` (`id`),
  CONSTRAINT `CK_ics_imports_user_id` CHECK ((`user_id` <= 10))
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table tododashboardv2.inrelevantappointments
CREATE TABLE IF NOT EXISTS `inrelevantappointments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `appointmentid` int NOT NULL,
  `userid` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `appointmentid` (`appointmentid`),
  KEY `userid` (`userid`),
  CONSTRAINT `inrelevantappointments_ibfk_1` FOREIGN KEY (`appointmentid`) REFERENCES `appointments` (`id`),
  CONSTRAINT `inrelevantappointments_ibfk_2` FOREIGN KEY (`userid`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=210 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for procedure tododashboardv2.insertAtodoTask
DELIMITER //
CREATE PROCEDURE `insertAtodoTask`(IN title VARCHAR(255), IN description VARCHAR(255), IN insertDate DATE, IN isCHEAgenda BOOLEAN, IN user_id INT)
BEGIN
    DECLARE isCHEAgendaCheck BOOLEAN DEFAULT false;
    IF isCHEAgenda IS NOT NULL THEN
        SET isCHEAgendaCheck = isCHEAgenda;
    END IF;

    SET @todoOrder = 0;
    SELECT todoOrder INTO @todoOrder FROM todos WHERE date = insertDate AND userId = 10 order by todoOrder desc limit 1;

    INSERT INTO todos (title, description, date, todoOrder, isCHEAgenda, userId) VALUES  (title, description, insertDate, (@todoOrder + 1), isCHEAgendaCheck, user_id);
    SELECT LAST_INSERT_ID() as id;
END//
DELIMITER ;

-- Dumping structure for procedure tododashboardv2.sp_create_backup
DELIMITER //
CREATE PROCEDURE `sp_create_backup`(IN userid INT)
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
                                   'iswebcall', appointments.iswebcall))
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

END//
DELIMITER ;

-- Dumping structure for table tododashboardv2.todos
CREATE TABLE IF NOT EXISTS `todos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` varchar(1000) NOT NULL,
  `date` date NOT NULL,
  `todoOrder` int NOT NULL,
  `isCHEagenda` tinyint(1) DEFAULT '0',
  `userId` int NOT NULL,
  `checked` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=278 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table tododashboardv2.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `webcallurl` varchar(255) DEFAULT NULL,
  `webcalllastsynced` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_username` (`username`),
  UNIQUE KEY `uq_email` (`email`),
  UNIQUE KEY `uq_username_email` (`username`,`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
