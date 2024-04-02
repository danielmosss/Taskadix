package DELETE

import (
	"api/functions"
	"api/handlers"
	"encoding/json"
	"io/ioutil"
	"net/http"
)

func DeleteTodoTask(res http.ResponseWriter, req *http.Request) {
	body, err := ioutil.ReadAll(req.Body)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	var newTask handlers.TodoCard
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

	query := "DELETE FROM todos WHERE id = ? AND userId = ?;"
	result, err := dbConnection.Query(query, newTask.Id, userId)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}
	defer result.Close()
	defer dbConnection.Close()
}
