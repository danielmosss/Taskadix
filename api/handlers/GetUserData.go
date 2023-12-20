package handlers

import (
	"api/functions"
	"fmt"
	"net/http"
)

func GetUserData(res http.ResponseWriter, req *http.Request) {
	userId, err := functions.GetUserID(req)
	if err != nil {
		http.Error(res, err.Error(), http.StatusUnauthorized)
		return
	}
	fmt.Println(userId)

	dbConnection, err := functions.GetDatabaseConnection()
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	query := "SELECT username FROM users WHERE id = ?;"
	result, err := dbConnection.Query(query, userId)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}
	defer result.Close()
	defer dbConnection.Close()

	var username string
	for result.Next() {
		err := result.Scan(&username)
		if err != nil {
			http.Error(res, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	res.Header().Set("Content-Type", "application/json")
	res.Write([]byte(`{"username": "` + username + `"}`))
}
