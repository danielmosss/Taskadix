package POST

import (
	"api/functions"
	"encoding/json"
	"io/ioutil"
	"net/http"
)

func PostWebcallSync(res http.ResponseWriter, req *http.Request) {
	userId, err := functions.GetUserID(req)
	if err != nil {
		http.Error(res, err.Error(), http.StatusUnauthorized)
		return
	}

	body, err := ioutil.ReadAll(req.Body)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	var ics_id int
	if err := json.Unmarshal(body, &ics_id); err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	dbConnection, err := functions.GetDatabaseConnection()
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	query := "SELECT 1 FROM ics_imports WHERE user_id = ? AND id = ? AND (ics_last_synced_at < DATE_SUB(NOW(), INTERVAL 1 DAY) OR ics_last_synced_at IS NULL);"
	result, err := dbConnection.Query(query, userId, ics_id)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}
	defer result.Close()

	if !result.Next() {
		http.Error(res, "Webcall lastest sync is less than 1 day ago", http.StatusForbidden)
		return
	}

	defer dbConnection.Close()

	functions.ProcessCalanderData(userId, ics_id)

	res.Header().Set("Content-Type", "application/json")
	res.Write([]byte(`{"status": "success"}`))
}
