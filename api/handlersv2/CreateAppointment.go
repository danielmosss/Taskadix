package handlersv2

import (
	"api/functions"
	"encoding/json"
	"io/ioutil"
	"net/http"
)

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

	var newAppointment NewAppointment
	if err := json.Unmarshal(body, &newAppointment); err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	query := `INSERT INTO appointments 
			      (userid, title, description, date, isallday, starttime, endtime, location, categoryid) 
			  VALUES 
			      (?,?,?,?,?,?,?,?,?);`

	_, err = dbConnection.Query(query, userId, newAppointment.Title, newAppointment.Description, newAppointment.Date, newAppointment.IsAllDay, newAppointment.StartTime, newAppointment.EndTime, newAppointment.Location, newAppointment.Category.ID)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	res.WriteHeader(http.StatusOK)
}
