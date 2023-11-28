package handlers

import (
	"api/functions"
	"encoding/json"
	"io/ioutil"
	"net/http"
)

func PostMarkAsIrrelevant(res http.ResponseWriter, req *http.Request) {
	body, err := ioutil.ReadAll(req.Body)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	var markTask todoCard
	if err := json.Unmarshal(body, &markTask); err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	dbConnection, err := functions.GetDatabaseConnection()
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	query := "call insertAnIrrelevantAgendaTodo(?);"
	result, err := dbConnection.Query(query, markTask.Id)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}
	defer result.Close()
	defer dbConnection.Close()

	res.Header().Set("Content-Type", "application/json")
	res.Write([]byte(`{"status": "success"}`))
}
