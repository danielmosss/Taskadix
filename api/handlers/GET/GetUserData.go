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

	query := "SELECT username, email FROM users WHERE id = ?;"
	result, err := dbConnection.Query(query, userId)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	query2 := "SELECT id, ics_url, ics_last_synced_at from ics_imports WHERE user_id = ?;"
	result2, err := dbConnection.Query(query2, userId)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	defer result.Close()
	defer dbConnection.Close()

	var userdata handlers.UserData
	for result.Next() {
		err := result.Scan(&userdata.Username, &userdata.Email)
		if err != nil {
			http.Error(res, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	for result2.Next() {
		var ics_import handlers.ICS_import
		var ics_url sql.NullString
		var ics_last_synced_at sql.NullString
		err := result2.Scan(&ics_import.Id, &ics_url, &ics_last_synced_at)
		if err != nil {
			http.Error(res, err.Error(), http.StatusInternalServerError)
			return
		}

		if ics_url.Valid {
			ics_import.IcsUrl = ics_url.String
		}
		if ics_last_synced_at.Valid {
			ics_import.IcsLastSyncedAt = ics_last_synced_at.String
		}

		if ics_import.Id == 1 && ics_import.IcsUrl == "" && ics_import.IcsLastSyncedAt == "" {
			continue
		} else {
			userdata.ICS_imports = append(userdata.ICS_imports, ics_import)
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
