package handlersv2

import (
	"api/functions"
	"encoding/json"
	"net/http"
)

func CreateCategory(res http.ResponseWriter, req *http.Request) {
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

	var newCategory Category
	err = json.NewDecoder(req.Body).Decode(&newCategory)
	if err != nil {
		http.Error(res, err.Error(), http.StatusBadRequest)
		return
	}

	query := "INSERT INTO appointment_category (term, color, userid) VALUES (?, ?, ?);"
	result, err := dbConnection.Exec(query, newCategory.Term, newCategory.Color, userId)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	var lastInsertedId int64
	lastInsertedId, err = result.LastInsertId()
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	var createdCategory Category
	querySelect := "SELECT * FROM appointment_category WHERE id = ?;"
	row := dbConnection.QueryRow(querySelect, lastInsertedId)
	err = row.Scan(&createdCategory.ID, &createdCategory.Term, &createdCategory.Color, &createdCategory.UserId, &createdCategory.IsDefault)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	jsondata, err := json.Marshal(createdCategory)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	res.Header().Set("Content-Type", "application/json")
	res.Write(jsondata)
}
