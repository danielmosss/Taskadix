package New

import (
	"api/functions"
	"api/handlers"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"strconv"
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

	var newAppointment handlers.NewAppointment
	if err := json.Unmarshal(body, &newAppointment); err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
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
