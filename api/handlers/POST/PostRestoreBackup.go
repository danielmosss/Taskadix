package POST

import (
	"api/functions"
	"api/functions/QueryFunctions"
	"api/handlers"
	"encoding/json"
	"io/ioutil"
	"net/http"
)

func RestoreBackup(res http.ResponseWriter, req *http.Request) {
	body, err := ioutil.ReadAll(req.Body)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	var backup handlers.BackupTemplate
	if err := json.Unmarshal(body, &backup); err != nil {
		http.Error(res, err.Error(), http.StatusUnprocessableEntity)
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

	queryDelTodo := `DELETE FROM todos WHERE userId = ?;`
	queryDelCategory := `DELETE FROM appointment_category WHERE userId = ?;`
	queryDelAppointment := `DELETE FROM appointments WHERE userId = ?;`
	_, err = dbConnection.Exec(queryDelTodo, userId)
	_, err = dbConnection.Exec(queryDelCategory, userId)
	_, err = dbConnection.Exec(queryDelAppointment, userId)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	if len(backup.Todos) > 0 {
		for _, todo := range backup.Todos {
			query := "call insertAtodoTask(?, ?, ?, ?, ?);"
			_, err := dbConnection.Query(query, todo.Title, todo.Description, todo.Date, false, userId)
			if err != nil {
				return
			}
		}
	}

	if len(backup.Categories) > 0 {
		for _, category := range backup.Categories {
			_, err := QueryFunctions.InsertCategory(category.Term, category.Color, userId)
			if err != nil {
				return
			}
		}
	}

	if len(backup.Appointments) > 0 {
		query := `INSERT INTO appointments 
			      (userid, title, description, date, isallday, starttime, endtime, location, categoryid) 
			  VALUES 
			      (?,?,?,?,?,?,?,?,?);`
		querySelectCategoryId := `SELECT id FROM appointment_category WHERE term = ? AND (userid = ? OR isdefault = 1);`
		for _, appo := range backup.Appointments {
			result, err := dbConnection.Query(querySelectCategoryId, appo.Category.Term, userId)
			if err != nil {
				return
			}

			var categoryId int
			for result.Next() {
				err := result.Scan(&categoryId)
				if err != nil {
					return
				}
			}

			_, err = dbConnection.Exec(query, userId, appo.Title, appo.Description, appo.Date, appo.IsAllDay, appo.StartTime, appo.EndTime, appo.Location, categoryId)
			if err != nil {
				return
			}
		}
	}

	res.Write([]byte("{\"status\":\"success\"}"))
}
