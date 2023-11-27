package handlers

import (
	"api/functions"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

type newTask struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Date        string `json:"date"`
}

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

	query := "call insertAtodoTask(?, ?, ?);"
	result, err := dbConnection.Query(query, newTask.Title, newTask.Description, newTask.Date)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}
	defer result.Close()
	defer dbConnection.Close()

	GetTodoTasks(res, req)
}
