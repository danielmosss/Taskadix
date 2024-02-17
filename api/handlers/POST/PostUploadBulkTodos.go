package POST

import (
	"api/functions"
	"api/handlers"
	"encoding/json"
	"io/ioutil"
	"net/http"
)

func UploadBulkTodo(res http.ResponseWriter, req *http.Request) {
	body, err := ioutil.ReadAll(req.Body)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	var newTask []handlers.NewTask
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

	returnTasks := []handlers.TodoCard{}

	for _, task := range newTask {
		query := "call insertAtodoTask(?, ?, ?, ?, ?);"
		result, err := dbConnection.Query(query, task.Title, task.Description, task.Date, false, userId)
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

		var task handlers.TodoCard
		query = "SELECT id, title, description, date, todoOrder, checked, isCHEagenda FROM todos WHERE id = ?;"
		result, err = dbConnection.Query(query, id)
		if err != nil {
			http.Error(res, err.Error(), http.StatusInternalServerError)
			return
		}
		defer result.Close()

		for result.Next() {
			err := result.Scan(&task.Id, &task.Title, &task.Description, &task.Date, &task.TodoOrder, &task.Checked, &task.IsCHE)
			if err != nil {
				http.Error(res, err.Error(), http.StatusInternalServerError)
				return
			}
		}

		returnTasks = append(returnTasks, task)
	}

	tasksJSON, err := json.Marshal(returnTasks)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	res.Write(tasksJSON)
}
