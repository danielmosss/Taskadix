package PUT

import (
	"api/functions"
	"api/handlers"
	"encoding/json"
	"io/ioutil"
	"net/http"
)

func PutTodoTasks(res http.ResponseWriter, req *http.Request) {
	body, err := ioutil.ReadAll(req.Body)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	var tasks []handlers.TodoCard
	if err := json.Unmarshal(body, &tasks); err != nil {
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

	for _, task := range tasks {
		query := "UPDATE todos SET title = ?, description = ?, date = ?, todoOrder = ? WHERE id = ? AND userId = ?;"
		result, err := dbConnection.Query(query, task.Title, task.Description, task.Date, task.TodoOrder, task.Id, userId)
		if err != nil {
			http.Error(res, err.Error(), http.StatusInternalServerError)
			return
		}
		defer result.Close()
	}

	defer dbConnection.Close()

	res.WriteHeader(http.StatusOK)
}
