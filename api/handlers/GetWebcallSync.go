package handlers

import (
	"api/functions"
	"net/http"
)

func GetWebcallSync(res http.ResponseWriter, req *http.Request) {
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

	query := "SELECT 1 FROM users WHERE id = ? AND (webcalllastsynced < DATE_SUB(NOW(), INTERVAL 1 DAY) OR webcalllastsynced IS NULL)"
	result, err := dbConnection.Query(query, userId)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}
	defer result.Close()

	if !result.Next() {
		http.Error(res, "Webcall lastest sync is less than 1 day ago", http.StatusForbidden)
		return
	}

	updateSync := "UPDATE users SET webcalllastsynced = NOW() WHERE id = ?;"
	resultUpdate, err := dbConnection.Query(updateSync, userId)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}
	defer resultUpdate.Close()
	defer dbConnection.Close()

	res.Header().Set("Content-Type", "application/json")
	res.Write([]byte(`{"status": "success"}`))
}
