package handlers

import (
	"api/functions"
	"database/sql"
	"encoding/json"
	"io/ioutil"
	"net/http"
)

func PutTodoTaskInfo(res http.ResponseWriter, req *http.Request) {
	body, err := ioutil.ReadAll(req.Body)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	var newTask todoCard
	if err := json.Unmarshal(body, &newTask); err != nil {
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

	querySelectOldDate := "SELECT date FROM todos WHERE id = ? AND userId = ?;"
	resultOldDate, err := dbConnection.Query(querySelectOldDate, newTask.Id, userId)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}
	defer resultOldDate.Close()

	// Update the title or description of a task
	query := "UPDATE todos SET title = ?, description = ? WHERE id = ? AND userId = ?;"
	result, err := dbConnection.Query(query, newTask.Title, newTask.Description, newTask.Id, userId)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}
	defer result.Close()

	var oldDate string
	for resultOldDate.Next() {
		err := resultOldDate.Scan(&oldDate)
		if err != nil {
			http.Error(res, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	if oldDate != newTask.Date {
		querySelectMaxTodoOrder := "SELECT MAX(todoOrder) FROM todos WHERE userId = ? AND date = ?;"
		resultMaxTodoOrder, err := dbConnection.Query(querySelectMaxTodoOrder, userId, newTask.Date)
		if err != nil {
			http.Error(res, err.Error(), http.StatusInternalServerError)
			return
		}

		var maxTodoOrder sql.NullInt64
		for resultMaxTodoOrder.Next() {
			err := resultMaxTodoOrder.Scan(&maxTodoOrder)
			if err != nil {
				http.Error(res, err.Error(), http.StatusInternalServerError)
				return
			}
		}

		if !maxTodoOrder.Valid {
			maxTodoOrder.Int64 = 0
		}

		queryUpdateDateAndTodoOrder := "UPDATE todos SET date = ?, todoOrder = ? WHERE id = ? AND userId = ?;"
		resultUpdateDateAndTodoOrder, err := dbConnection.Query(queryUpdateDateAndTodoOrder, newTask.Date, maxTodoOrder.Int64+1, newTask.Id, userId)
		if err != nil {
			http.Error(res, err.Error(), http.StatusInternalServerError)
			return
		}
		defer resultUpdateDateAndTodoOrder.Close()
	}
	defer dbConnection.Close()
}
