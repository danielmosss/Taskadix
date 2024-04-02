package POST

import (
	"api/functions"
	"api/handlers"
	"encoding/json"
	"io/ioutil"
	"net/http"
)

func PostCheckTodoTask(res http.ResponseWriter, req *http.Request) {
	body, err := ioutil.ReadAll(req.Body)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	var markTask handlers.TodoCard
	if err := json.Unmarshal(body, &markTask); err != nil {
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

	query := "UPDATE todos SET checked = ? WHERE id = ? AND userId = ?;"
	result, err := dbConnection.Query(query, markTask.Checked, markTask.Id, userId)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}
	defer result.Close()
	defer dbConnection.Close()

	res.Header().Set("Content-Type", "application/json")
	res.Write([]byte(`{"status": "success"}`))
}
