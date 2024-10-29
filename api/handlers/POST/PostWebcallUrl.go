package POST

import (
	"api/functions"
	"api/handlers"
	"encoding/json"
	"io/ioutil"
	"net/http"
)

func PostWebcallUrl(res http.ResponseWriter, req *http.Request) {
	body, err := ioutil.ReadAll(req.Body)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	var url handlers.Url
	if err := json.Unmarshal(body, &url); err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	dbConnection, err := functions.GetDatabaseConnection()
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	userId, err := functions.GetUserID(req)
	if err != nil {
		http.Error(res, err.Error(), http.StatusUnauthorized)
		return
	}

	if url.Id != 0 && url.Url == "" {
		queryDeleteInrelevant := "DELETE FROM inrelevantappointments WHERE userid = ? AND appointmentid IN (SELECT id FROM appointments WHERE ics_import_id = ?);"
		resultDeleteInrelevant, err := dbConnection.Query(queryDeleteInrelevant, userId, url.Id)
		if err != nil {
			http.Error(res, err.Error(), http.StatusInternalServerError)
			return
		}

		queryDelete := "DELETE FROM appointments WHERE userid = ? AND ics_import_id = ?;"
		resultDelete, err := dbConnection.Query(queryDelete, userId, url.Id)
		if err != nil {
			http.Error(res, err.Error(), http.StatusInternalServerError)
			return
		}

		queryDelete2 := "DELETE FROM ics_imports WHERE user_id = ? AND id = ?;"
		resultDelete2, err := dbConnection.Query(queryDelete2, userId, url.Id)
		if err != nil {
			http.Error(res, err.Error(), http.StatusInternalServerError)
			return
		}
		defer resultDeleteInrelevant.Close()
		defer resultDelete.Close()
		defer resultDelete2.Close()
		defer dbConnection.Close()
	} else if url.Id == 0 {
		queryInsert := "INSERT INTO ics_imports (user_id, ics_url, category_id) VALUES (?, ?, ?);"
		resultInsert, err := dbConnection.Query(queryInsert, userId, url.Url, url.Category_id)
		if err != nil {
			http.Error(res, err.Error(), http.StatusInternalServerError)
			return
		}
		defer resultInsert.Close()
		defer dbConnection.Close()
	}

	res.Header().Set("Content-Type", "application/json")
	res.Write([]byte(`{"status": "success"}`))
}
