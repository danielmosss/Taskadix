package handlersv2

import (
	"api/functions"
	"encoding/json"
	"net/http"
)

func GetCategories(res http.ResponseWriter, req *http.Request) {
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

	query := "SELECT id, term FROM appointment_category WHERE userid = ? OR isdefault = 1;"
	rows, err := dbConnection.Query(query, userId)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()
	defer dbConnection.Close()

	var categories []Category
	for rows.Next() {
		var category Category
		err := rows.Scan(&category.ID, &category.Term)
		if err != nil {
			http.Error(res, err.Error(), http.StatusInternalServerError)
			return
		}
		categories = append(categories, category)
	}

	jsondata, err := json.Marshal(categories)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	res.Header().Set("Content-Type", "application/json")
	res.Write(jsondata)
}
