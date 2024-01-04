package handlers

import (
	"api/functions"
	"database/sql"
	"encoding/json"
	"net/http"
)

type userData struct {
	Username          string `json:"username"`
	Email             string `json:"email"`
	Webcallurl        string `json:"webcallurl"`
	Webcalllastsynced string `json:"webcalllast"`
	BackgroundColor   string `json:"backgroundcolor"`
}

func GetUserData(res http.ResponseWriter, req *http.Request) {
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

	query := "SELECT username, email, webcallurl, webcalllastsynced, backgroundcolor FROM users WHERE id = ?;"
	result, err := dbConnection.Query(query, userId)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}
	defer result.Close()
	defer dbConnection.Close()

	var userdata userData
	for result.Next() {
		var webcallurl sql.NullString
		var webcalllastsynced sql.NullString

		// webcallurl and webcalllastsynced are nullable, so we need to check for null values
		err := result.Scan(&userdata.Username, &userdata.Email, &webcallurl, &webcalllastsynced, &userdata.BackgroundColor)
		if err != nil {
			http.Error(res, err.Error(), http.StatusInternalServerError)
			return
		}

		if webcallurl.Valid {
			userdata.Webcallurl = webcallurl.String
		} else {
			userdata.Webcallurl = ""
		}
		if webcalllastsynced.Valid {
			userdata.Webcalllastsynced = webcalllastsynced.String
		} else {
			userdata.Webcalllastsynced = ""
		}
	}

	jsondata, err := json.Marshal(userdata)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	res.Header().Set("Content-Type", "application/json")
	res.Write(jsondata)
}
