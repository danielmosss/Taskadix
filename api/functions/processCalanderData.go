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

func ProcessCalanderData(userid int, ics_id int) {
	dbconnection, err := GetDatabaseConnection()
	if err != nil {
		panic(err.Error())
	}

	query := "SELECT ics_url FROM ics_imports WHERE user_id = ? AND id = ?;"
	result, err := dbconnection.Query(query, userid, ics_id)
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

	updateSync := "UPDATE ics_imports SET ics_last_synced_at = NOW() WHERE user_id = ? AND id = ?;"
	resultUpdate, err := dbconnection.Query(updateSync, userid, ics_id)
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
		isAllDay := false
		startValue := event.GetProperty(ics.ComponentPropertyDtStart).Value
		endValue := event.GetProperty(ics.ComponentPropertyDtEnd).Value

		if startValue[len(startValue)-1] == 'Z' {
			startValue = startValue[:len(startValue)-1]
		}

		if endValue[len(endValue)-1] == 'Z' {
			endValue = endValue[:len(endValue)-1]
		}

		if len(endValue) == 8 && len(startValue) == 8 {
			isAllDay = true
		}

		if len(startValue) == 8 {
			startValue = startValue + "T000000"
		}

		if len(endValue) == 8 {
			endValue = endValue + "T000000"
		}

		start, _ := time.ParseInLocation("20060102T150405", startValue, loc)
		end, _ := time.ParseInLocation("20060102T150405", endValue, loc)

		title := event.GetProperty(ics.ComponentPropertySummary).Value
		title = strings.Replace(title, "\\", "", -1)
		title = strings.Split(title, ",")[0]

		locationProperty := event.GetProperty(ics.ComponentPropertyLocation)
		location := ""
		if locationProperty != nil {
			location = locationProperty.Value
			location = strings.Replace(location, "@", "", -1)
			location = strings.Replace(location, "\\", "", -1)
		}

		descriptionProperty := event.GetProperty(ics.ComponentPropertyDescription)
		description := ""
		if descriptionProperty != nil {
			description = descriptionProperty.Value
			description = strings.Replace(description, "\\", "", -1)
		}

		// check if endtime is before starttime
		if end.Before(start) {
			end = start.Add(1 * time.Hour)
		}

		//check if endtime is next day and starttime is previous day
		if end.Day() != start.Day() {

			for i := 0; i <= end.Day()-start.Day(); i++ {
				if i == 0 {
					appointments = append(appointments, handlers.NewAppointment{
						Title:       title,
						Description: description,
						Date:        start.Format("2006-01-02"),
						IsAllDay:    false,
						StartTime:   start.Format("15:04"),
						EndTime:     "23:59",
						Location:    location,
					})
				} else if i == end.Day()-start.Day() {
					endtime := end.Format("15:04")
					if endtime == "00:00" {
						endtime = "23:59"
					}
					appointments = append(appointments, handlers.NewAppointment{
						Title:       title,
						Description: description,
						Date:        end.Format("2006-01-02"),
						IsAllDay:    false,
						StartTime:   "00:00",
						EndTime:     endtime,
						Location:    location,
					})
				} else {
					appointments = append(appointments, handlers.NewAppointment{
						Title:       title,
						Description: description,
						Date:        start.AddDate(0, 0, i).Format("2006-01-02"),
						IsAllDay:    false,
						StartTime:   "00:00",
						EndTime:     "23:59",
						Location:    location,
					})
				}
			}

		} else {
			appointments = append(appointments, handlers.NewAppointment{
				Title:       title,
				Description: description,
				Date:        start.Format("2006-01-02"),
				IsAllDay:    isAllDay,
				StartTime:   start.Format("15:04"),
				EndTime:     end.Format("15:04"),
				Location:    location,
			})
		}
	}

	return appointments, nil
}

func taskExistsInDB(appointment handlers.NewAppointment, userId int) bool {
	dbConnection, err := GetDatabaseConnection()
	if err != nil {
		panic(err.Error())
	}
	defer dbConnection.Close()

	query := `SELECT COUNT(*) FROM appointments WHERE title = ? 
                                    AND description = ? 
                                    AND date = ? 
                                    AND starttime = ?
                                    AND endtime = ?
                                    AND userId = ? 
                                    AND isWebCall = 1
                                    AND categoryid = (select id from appointment_category where isdefault = 1 and term = 'School');`
	result, err := dbConnection.Query(query, appointment.Title, appointment.Description, appointment.Date, appointment.StartTime, appointment.EndTime, userId)
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
			      (userid, title, description, date, isallday, starttime, endtime, location, categoryid, isWebCall)
			  VALUES
			      (?,?,?,?,?,?,?,?,(select id from appointment_category where isdefault = 1 and term = 'School'), 1);`

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
