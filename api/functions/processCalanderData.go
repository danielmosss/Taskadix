package functions

import (
	"api/handlers"
	"fmt"
	ics "github.com/arran4/golang-ical"
	"net/http"
	"strings"
	"time"
	_ "time/tzdata"
)

func ProcessCalanderData(userid int) {
	dbconnection, err := GetDatabaseConnection()
	if err != nil {
		panic(err.Error())
	}

	query := "SELECT webcallurl FROM users WHERE id = ?;"
	result, err := dbconnection.Query(query, userid)
	if err != nil {
		panic(err.Error())
	}

	var webcallurl string
	for result.Next() {
		err := result.Scan(&webcallurl)
		if err != nil {
			panic(err.Error())
		}
	}

	defer result.Close()

	appointments, err := fetchCalendarData(webcallurl)
	if err != nil {
		fmt.Println(err)
		return
	}

	for _, appointment := range appointments {
		fmt.Println(appointment)
		if !taskExistsInDB(appointment, userid) {
			insertAppointmentIntoDB(appointment, userid)
		}
	}

	updateSync := "UPDATE users SET webcalllastsynced = NOW() WHERE id = ?;"
	resultUpdate, err := dbconnection.Query(updateSync, userid)
	if err != nil {
		panic(err.Error())
	}
	defer resultUpdate.Close()
	defer dbconnection.Close()
}

func fetchCalendarData(webcallurl string) ([]handlers.NewAppointment, error) {
	url := strings.Replace(webcallurl, "webcal", "https", 1)

	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	// Parseren van ICS-bestand
	calendar, err := ics.ParseCalendar(resp.Body)
	if err != nil {
		return nil, err
	}

	var appointments []handlers.NewAppointment
	loc, error := time.LoadLocation("Europe/Amsterdam")
	if error != nil {
		return nil, error
	}
	for _, event := range calendar.Events() {
		start, _ := time.ParseInLocation("20060102T150405", event.GetProperty(ics.ComponentPropertyDtStart).Value, loc)
		end, _ := time.ParseInLocation("20060102T150405", event.GetProperty(ics.ComponentPropertyDtEnd).Value, loc)

		title := event.GetProperty(ics.ComponentPropertySummary).Value
		title = strings.Replace(title, "\\", "", -1)
		title = strings.Split(title, ",")[0]

		location := event.GetProperty(ics.ComponentPropertyLocation).Value
		location = strings.Replace(location, "@", "", -1)
		location = strings.Replace(location, "\\", "", -1)

		description := getICSproperty(event, ics.ComponentPropertyDescription)
		description = strings.Replace(description, "\\", "", -1)

		// check if endtime is before starttime
		if end.Before(start) {
			end = start.Add(1 * time.Hour)
		}

		appointments = append(appointments, handlers.NewAppointment{
			Title:       title,
			Description: description,
			Date:        start.Format("2006-01-02"),
			IsAllDay:    false,
			StartTime:   start.Format("15:04"),
			EndTime:     end.Format("15:04"),
			Location:    location,
		})
	}

	return appointments, nil
}

func taskExistsInDB(appointment handlers.NewAppointment, userId int) bool {
	dbConnection, err := GetDatabaseConnection()
	if err != nil {
		panic(err.Error())
	}
	defer dbConnection.Close()

	query := "SELECT COUNT(*) FROM appointments WHERE title = ? AND description = ? AND date = ? AND userId = ? AND categoryid = (select id from appointment_category where isdefault = 1 and term = 'School');"
	result, err := dbConnection.Query(query, appointment.Title, appointment.Description, appointment.Date, userId)
	if err != nil {
		panic(err.Error())
	}
	defer result.Close()

	var count int
	for result.Next() {
		err := result.Scan(&count)
		if err != nil {
			panic(err.Error())
		}
	}

	return count > 0
}

func insertAppointmentIntoDB(newAppointment handlers.NewAppointment, userId int) {
	dbConnection, err := GetDatabaseConnection()
	if err != nil {
		panic(err.Error())
	}

	query := `INSERT INTO appointments
			      (userid, title, description, date, isallday, starttime, endtime, location, categoryid)
			  VALUES
			      (?,?,?,?,?,?,?,?,(select id from appointment_category where isdefault = 1 and term = 'School'));`

	_, err = dbConnection.Exec(query, userId, newAppointment.Title, newAppointment.Description, newAppointment.Date, newAppointment.IsAllDay, newAppointment.StartTime, newAppointment.EndTime, newAppointment.Location)
	if err != nil {
		panic(err.Error())
	}
	defer dbConnection.Close()
}

func getICSproperty(event *ics.VEvent, property ics.ComponentProperty) string {
	result := event.GetProperty(property)
	if result == nil {
		return ""
	}
	if result.Value != "" {
		return result.Value
	}
	return ""
}
