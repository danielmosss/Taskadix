package handlers

import (
	"api/functions"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

type Task struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Date        string `json:"date"`
	TodoOrder   int    `json:"todoOrder"`
}

func PutTodoTasks(res http.ResponseWriter, req *http.Request) {
	fmt.Println("PutTodoTasks called")

	body, err := ioutil.ReadAll(req.Body)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	var tasks []Task
	if err := json.Unmarshal(body, &tasks); err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	dbConnection, err := functions.GetDatabaseConnection()
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	for _, task := range tasks {
		query := "UPDATE todos SET title = ?, description = ?, date = ?, todoOrder = ? WHERE id = ?;"
		result, err := dbConnection.Query(query, task.Title, task.Description, task.Date, task.TodoOrder, task.ID)
		if err != nil {
			http.Error(res, err.Error(), http.StatusInternalServerError)
			return
		}
		defer result.Close()
	}

	defer dbConnection.Close()

	GetTodoTasks(res, req)
}
