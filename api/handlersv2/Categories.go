package handlersv2

import (
	"api/functions"
	"database/sql"
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

	query := "SELECT * FROM appointment_category WHERE userid = ? OR isdefault = 1;"
	rows, err := dbConnection.Query(query, userId)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()
	defer dbConnection.Close()

	var categories []Category
	for rows.Next() {
		var userId sql.NullInt64
		var category Category
		err := rows.Scan(&category.ID, &category.Term, &category.Color, &userId, &category.IsDefault)
		if err != nil {
			http.Error(res, err.Error(), http.StatusInternalServerError)
			return
		}
		if userId.Valid {
			category.UserId = int(userId.Int64)
		} else {
			category.UserId = 0
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

func DeleteCategory(res http.ResponseWriter, req *http.Request) {
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

	var categoryId = req.URL.Query().Get("id")
	if categoryId == "" {
		http.Error(res, "id is required", http.StatusBadRequest)
		return
	}

	query := "DELETE FROM appointment_category WHERE id = ? AND userid = ? AND isdefault = 0;"
	_, err = dbConnection.Exec(query, categoryId, userId)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	res.Header().Set("Content-Type", "application/json")
	res.Write([]byte(`{"message": "Category deleted"}`))
}
