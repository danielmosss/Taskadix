package New

import (
	"api/functions"
	"api/handlers"
	"encoding/json"
	"net/http"
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
