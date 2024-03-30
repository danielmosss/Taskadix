package handlersv2

import (
	"api/functions"
	"encoding/json"
	"net/http"
)

func PutCategory(res http.ResponseWriter, req *http.Request) {
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

	var updatedCategory Category
	err = json.NewDecoder(req.Body).Decode(&updatedCategory)
	if err != nil {
		http.Error(res, err.Error(), http.StatusBadRequest)
		return
	}

	var selectFromDB Category
	querySelect := "SELECT * FROM appointment_category WHERE id = ? AND userid = ?;"
	row := dbConnection.QueryRow(querySelect, updatedCategory.ID, userId)
	err = row.Scan(&selectFromDB.ID, &selectFromDB.Term, &selectFromDB.Color, &selectFromDB.UserId, &selectFromDB.IsDefault)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	if selectFromDB.IsDefault {
		http.Error(res, "Default category cannot be updated", http.StatusBadRequest)
		return
	}

	query := "UPDATE appointment_category SET term = ?, color = ? WHERE id = ? AND userid = ?;"
	_, err = dbConnection.Exec(query, updatedCategory.Term, updatedCategory.Color, updatedCategory.ID, userId)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	jsondata, err := json.Marshal(updatedCategory)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	res.Header().Set("Content-Type", "application/json")
	res.Write(jsondata)
}
