package handlers

import (
	"api/functions"
	"encoding/json"
	"io/ioutil"
	"net/http"
)

func PostTodoTask(res http.ResponseWriter, req *http.Request) {
	body, err := ioutil.ReadAll(req.Body)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	var newTask newTask
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

	// Create a new task with the given data and use a stored procedure to insert it into the database
	query := "call insertAtodoTask(?, ?, ?, ?, ?);"
	result, err := dbConnection.Query(query, newTask.Title, newTask.Description, newTask.Date, false, userId)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}
	defer result.Close()

	var id int
	for result.Next() {
		err := result.Scan(&id)
		if err != nil {
			http.Error(res, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	// Get the task that was just created and return it
	var task todoCard
	query = "SELECT id, title, description, date, todoOrder, checked, isCHEagenda FROM todos WHERE id = ?;"
	result, err = dbConnection.Query(query, id)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}
	defer result.Close()
	defer dbConnection.Close()

	for result.Next() {
		err := result.Scan(&task.Id, &task.Title, &task.Description, &task.Date, &task.TodoOrder, &task.Checked, &task.IsCHE)
		if err != nil {
			http.Error(res, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	taskJSON, err := json.Marshal(task)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	res.Write(taskJSON)
}
