package New

import (
	"api/functions"
	"api/handlers"
	"encoding/json"
	"net/http"
)

type responseAppointment struct {
	Date         string                 `json:"date"`
	Appointments []handlers.Appointment `json:"appointments"`
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
    ac.color
    FROM appointments a
         	  INNER JOIN appointment_category ac on a.categoryid = ac.id
			  WHERE a.userid = ?
			  AND date >= ? AND date <= ?`
	result, err := dbConnection.Query(query, userId, beginDate, endDate)
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
		)
		if err != nil {
			http.Error(res, err.Error(), http.StatusInternalServerError)
			return
		}
		appointmentMap[appointment.Date] = append(appointmentMap[appointment.Date], appointment)
	}

	var appointmentArray []responseAppointment
	for i, appointments := range appointmentMap {
		appointmentArray = append(appointmentArray, responseAppointment{
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
