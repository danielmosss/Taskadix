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
		queryDelete := "DELETE FROM ics_imports WHERE user_id = ? AND id = ?;"
		resultDelete, err := dbConnection.Query(queryDelete, userId, url.Id)
		if err != nil {
			http.Error(res, err.Error(), http.StatusInternalServerError)
			return
		}
		defer resultDelete.Close()
		defer dbConnection.Close()
	} else if url.Id == 0 {
		queryInsert := "INSERT INTO ics_imports (user_id, ics_url) VALUES (?, ?);"
		resultInsert, err := dbConnection.Query(queryInsert, userId, url.Url)
		if err != nil {
			http.Error(res, err.Error(), http.StatusInternalServerError)
			return
		}
		defer resultInsert.Close()
		defer dbConnection.Close()
	} else {
		queryUpdate := "UPDATE ics_imports SET ics_url = ? WHERE user_id = ? AND id = ?;"
		resultUpdate, err := dbConnection.Query(queryUpdate, url.Url, userId, url.Id)
		if err != nil {
			http.Error(res, err.Error(), http.StatusInternalServerError)
			return
		}
		defer resultUpdate.Close()
		defer dbConnection.Close()
	}

	res.Header().Set("Content-Type", "application/json")
	res.Write([]byte(`{"status": "success"}`))
}
