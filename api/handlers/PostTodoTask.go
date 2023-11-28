package handlers

import (
	"api/functions"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

func PostTodoTask(res http.ResponseWriter, req *http.Request) {
	fmt.Println("PostTodoTask called")

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

	query := "call insertAtodoTask(?, ?, ?, ?);"
	result, err := dbConnection.Query(query, newTask.Title, newTask.Description, newTask.Date, false)
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

	var task todoCard
	query = "SELECT id, title, description, date, todoOrder FROM todos WHERE id = ?;"
	result, err = dbConnection.Query(query, id)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}
	defer result.Close()
	defer dbConnection.Close()

	for result.Next() {
		err := result.Scan(&task.Id, &task.Title, &task.Description, &task.Date, &task.TodoOrder)
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
