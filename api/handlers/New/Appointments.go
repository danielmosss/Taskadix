package New

import (
	"api/functions"
	"api/handlers"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"strconv"
)

func GetAppointment(res http.ResponseWriter, req *http.Request) {
	id := req.URL.Query().Get("id")
	userId, err := functions.GetUserID(req)
	if err != nil {
		http.Error(res, err.Error(), http.StatusUnauthorized)
		return
	}

	dbConnection, err := functions.GetDatabaseConnection()
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	query := `SELECT 
    a.id,
    a.userid,
    a.title,
    a.description,
    a.date,
    a.isallday,
    a.starttime,
    a.endtime,
    a.location,
    a.categoryid,
    ac.term,
    ac.color
    FROM appointments a
         	  INNER JOIN appointment_category ac on a.categoryid = ac.id
			  WHERE a.userid = ? AND a.id = ?`

	result, err := dbConnection.Query(query, userId, id)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}
	defer result.Close()

	var appointment handlers.Appointment
	for result.Next() {
		err := result.Scan(
			&appointment.Id,
			&appointment.Userid,
			&appointment.Title,
			&appointment.Description,
			&appointment.Date,
			&appointment.IsAllDay,
			&appointment.StartTime,
			&appointment.EndTime,
			&appointment.Location,
			&appointment.Category.ID,
			&appointment.Category.Term,
			&appointment.Category.Color,
		)
		if err != nil {
			http.Error(res, err.Error(), http.StatusInternalServerError)
			return
		}
	}
	json, err := json.Marshal(appointment)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	res.Header().Set("Content-Type", "application/json")
	res.Write(json)
}

func GetAppointments(res http.ResponseWriter, req *http.Request) {
	userId, err := functions.GetUserID(req)
	if err != nil {
		http.Error(res, err.Error(), http.StatusUnauthorized)
		return
	}

	beginDate := req.URL.Query().Get("start")
	endDate := req.URL.Query().Get("end")

	dbConnection, err := functions.GetDatabaseConnection()
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}
	defer dbConnection.Close()

	query := `SELECT 
    a.id,
    a.userid,
    a.title,
    a.description,
    a.date, 
    a.isallday,
    a.starttime,
    a.endtime,
    a.location,
    a.categoryid,
    ac.term,
    ac.color,
    a.isWebCall
    FROM appointments a
         	  INNER JOIN appointment_category ac on a.categoryid = ac.id
       		  LEFT JOIN inrelevantappointments ia on a.id = ia.appointmentid AND ia.userid = ?
			  WHERE a.userid = ?
			  AND ia.appointmentid IS NULL
			  AND date >= ? AND date <= ?`
	result, err := dbConnection.Query(query, userId, userId, beginDate, endDate)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}
	defer result.Close()

	appointmentMap := make(map[string][]handlers.Appointment)
	for result.Next() {
		var appointment handlers.Appointment
		err := result.Scan(
			&appointment.Id,
			&appointment.Userid,
			&appointment.Title,
			&appointment.Description,
			&appointment.Date,
			&appointment.IsAllDay,
			&appointment.StartTime,
			&appointment.EndTime,
			&appointment.Location,
			&appointment.Category.ID,
			&appointment.Category.Term,
			&appointment.Category.Color,
			&appointment.IsWebCall,
		)
		if err != nil {
			http.Error(res, err.Error(), http.StatusInternalServerError)
			return
		}
		appointmentMap[appointment.Date] = append(appointmentMap[appointment.Date], appointment)
	}

	var appointmentArray []handlers.ResponseAppointment
	for i, appointments := range appointmentMap {
		appointmentArray = append(appointmentArray, handlers.ResponseAppointment{
			Date:         i,
			Appointments: appointments,
		})
	}

	JSON, err := json.Marshal(appointmentArray)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	res.Header().Set("Content-Type", "application/json")
	res.WriteHeader(http.StatusOK)
	res.Write(JSON)
}

func CreateAppointment(res http.ResponseWriter, req *http.Request) {
	userId, err := functions.GetUserID(req)
	if err != nil {
		http.Error(res, err.Error(), http.StatusUnauthorized)
		return
	}

	dbConnection, err := functions.GetDatabaseConnection()
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	body, err := ioutil.ReadAll(req.Body)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	var newAppointment handlers.NewAppointment
	if err := json.Unmarshal(body, &newAppointment); err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	// check if appointment endtime is 00:00 then set it to 23:59
	if newAppointment.EndTime == "00:00" {
		newAppointment.EndTime = "23:59"
	}

	// check if endtime is after starttime
	if newAppointment.EndTime < newAppointment.StartTime {
		http.Error(res, "Endtime is before starttime", http.StatusBadRequest)
		return
	}

	if newAppointment.IsAllDay == true {
		newAppointment.StartTime = ""
		newAppointment.EndTime = ""
	}

	query := `INSERT INTO appointments 
			      (userid, title, description, date, isallday, starttime, endtime, location, categoryid) 
			  VALUES 
			      (?,?,?,?,?,?,?,?,?);`

	result, err := dbConnection.Exec(query, userId, newAppointment.Title, newAppointment.Description, newAppointment.Date, newAppointment.IsAllDay, newAppointment.StartTime, newAppointment.EndTime, newAppointment.Location, newAppointment.Category.ID)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}
	// get last inserted id
	var lastInsertedId int64
	lastInsertedId, err = result.LastInsertId()
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	var lastInsertedId2 string
	lastInsertedId2 = strconv.FormatInt(lastInsertedId, 10)

	// return last inserted id
	res.Header().Set("Content-Type", "application/json")
	res.Write([]byte(`{"id": "` + lastInsertedId2 + `"}`))
}

func DeleteAppointment(res http.ResponseWriter, req *http.Request) {
	userId, err := functions.GetUserID(req)
	if err != nil {
		http.Error(res, err.Error(), http.StatusUnauthorized)
		return
	}

	dbConnection, err := functions.GetDatabaseConnection()
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	id := req.URL.Query().Get("id")
	querySelectIsWebCall := `SELECT isWebCall FROM appointments WHERE userid = ? AND id = ?;`
	result, err := dbConnection.Query(querySelectIsWebCall, userId, id)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}
	defer result.Close()

	var isWebCall int
	for result.Next() {
		err := result.Scan(&isWebCall)
		if err != nil {
			http.Error(res, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	if isWebCall == 1 {
		query := `INSERT INTO inrelevantappointments (userid, appointmentid) VALUES (?, ?);`
		_, err = dbConnection.Exec(query, userId, id)
		if err != nil {
			http.Error(res, err.Error(), http.StatusInternalServerError)
			return
		}
	} else {
		query := `DELETE FROM appointments WHERE userid = ? AND id = ?;`
		_, err = dbConnection.Exec(query, userId, id)
		if err != nil {
			http.Error(res, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	res.Header().Set("Content-Type", "application/json")
	res.Write([]byte(`{"status": "success"}`))
}

func UpdateAppointment(res http.ResponseWriter, req *http.Request) {
	userId, err := functions.GetUserID(req)
	if err != nil {
		http.Error(res, err.Error(), http.StatusUnauthorized)
		return
	}

	dbConnection, err := functions.GetDatabaseConnection()
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	body, err := ioutil.ReadAll(req.Body)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	var upAppi handlers.Appointment
	if err := json.Unmarshal(body, &upAppi); err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	// check if appointment endtime is 00:00 then set it to 23:59
	if upAppi.EndTime == "00:00" {
		upAppi.EndTime = "23:59"
	}

	if upAppi.IsAllDay == true {
		upAppi.StartTime = ""
		upAppi.EndTime = ""
	}

	// check if endtime is after starttime
	if upAppi.EndTime < upAppi.StartTime {
		http.Error(res, "Endtime is before starttime", http.StatusBadRequest)
		return
	}

	query := `UPDATE appointments 
			  SET title = ?, description = ?, date = ?, isallday = ?, starttime = ?, endtime = ?, location = ?, categoryid = ? 
			  WHERE userid = ? AND id = ?;`

	_, err = dbConnection.Exec(query, upAppi.Title, upAppi.Description, upAppi.Date, upAppi.IsAllDay, upAppi.StartTime, upAppi.EndTime, upAppi.Location, upAppi.Category.ID, userId, upAppi.Id)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	res.Header().Set("Content-Type", "application/json")
	res.Write([]byte(`{"id": "` + strconv.Itoa(upAppi.Id) + `"}`))
}

func GetTenLastLocationsUser(res http.ResponseWriter, req *http.Request) {
	userId, err := functions.GetUserID(req)
	if err != nil {
		http.Error(res, err.Error(), http.StatusUnauthorized)
		return
	}

	dbConnection, err := functions.GetDatabaseConnection()
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	query := `select distinct location
				from appointments
				where location is not null
				  and userid = ?
				limit 10;`
	result, err := dbConnection.Query(query, userId)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}
	defer result.Close()

	var location string
	var locations []string
	for result.Next() {
		err := result.Scan(&location)
		if err != nil {
			http.Error(res, err.Error(), http.StatusInternalServerError)
			return
		}
		if location != "" {
			locations = append(locations, location)
		}
	}

	JSON, err := json.Marshal(locations)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	res.Header().Set("Content-Type", "application/json")
	res.WriteHeader(http.StatusOK)
	res.Write(JSON)
}
