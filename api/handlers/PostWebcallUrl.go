package handlers

import (
	"api/functions"
	"encoding/json"
	"io/ioutil"
	"net/http"
)

type url struct {
	Url string `json:"url"`
}

func PostWebcallUrl(res http.ResponseWriter, req *http.Request) {
	body, err := ioutil.ReadAll(req.Body)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	var url url
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

	query := "SELECT * FROM users WHERE id = ? AND webcallurl IS NOT NULL;"
	result, err := dbConnection.Query(query, userId)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	if result.Next() {
		http.Error(res, "Webcall URL already set", http.StatusForbidden)
		return
	}

	queryUpdate := "UPDATE users SET webcallurl = ? WHERE webcallurl IS NULL AND id = ?;"
	resultUpdate, err := dbConnection.Query(queryUpdate, url.Url, userId)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}
	defer resultUpdate.Close()
	defer dbConnection.Close()

	res.Header().Set("Content-Type", "application/json")
	res.Write([]byte(`{"status": "success"}`))
}
