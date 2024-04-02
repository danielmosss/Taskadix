package GET

import (
	"api/functions"
	"api/handlers"
	"database/sql"
	"encoding/json"
	"net/http"
)

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

	query := "SELECT username, email, webcallurl, webcalllastsynced FROM users WHERE id = ?;"
	result, err := dbConnection.Query(query, userId)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}
	defer result.Close()
	defer dbConnection.Close()

	var userdata handlers.UserData
	for result.Next() {
		var webcallurl sql.NullString
		var webcalllastsynced sql.NullString

		// webcallurl and webcalllastsynced are nullable, so we need to check for null values
		err := result.Scan(&userdata.Username, &userdata.Email, &webcallurl, &webcalllastsynced)
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
