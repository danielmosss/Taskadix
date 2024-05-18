package GET

import (
	"api/functions"
	"api/handlers"
	"encoding/json"
	"net/http"
	"time"
)

func GetBackup(res http.ResponseWriter, req *http.Request) {
	userId, err := functions.GetUserID(req)
	if err != nil {
		http.Error(res, err.Error(), http.StatusUnauthorized)
		return
	}

	dbConnection, err := functions.GetDatabaseConnection()
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}
	defer dbConnection.Close()

	query := "SELECT id, username, email FROM users WHERE id = ?"
	queryTodos := "SELECT id, title, description, date, todoOrder, checked, isCHEagenda FROM todos WHERE userId = ? AND isCHEagenda = false ORDER BY date ASC, todoOrder ASC;"
	queryAppointments := `SELECT 
    a.id,
    a.userid,
    a.title,
    a.description,
    a.date,
    a.isallday,
    a.starttime,
    a.endtime,
    a.location,
    a.categoryid,
    ac.term,
    ac.color
    FROM appointments a
         	  INNER JOIN appointment_category ac on a.categoryid = ac.id
			  WHERE a.userid = ?`
	queryCategories := "SELECT * FROM appointment_category WHERE userid = ? AND isdefault = 0;"

	result, err := dbConnection.Query(query, userId)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
	}

	backup := handlers.BackupTemplate{}
	backup.TemplateV = 2
	backup.TimeCreated = time.DateTime

	for result.Next() {
		err := result.Scan(&backup.UserId, &backup.Username, &backup.Email)
		if err != nil {
			http.Error(res, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	resultTodos, err := dbConnection.Query(queryTodos, userId)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	resultAppointments, err := dbConnection.Query(queryAppointments, userId)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	resultCategories, err := dbConnection.Query(queryCategories, userId)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	for resultTodos.Next() {
		var todo handlers.TodoCard
		err := resultTodos.Scan(&todo.Id, &todo.Title, &todo.Description, &todo.Date, &todo.TodoOrder, &todo.Checked, &todo.IsCHE)
		if err != nil {
			http.Error(res, err.Error(), http.StatusInternalServerError)
			return
		}
		backup.Todos = append(backup.Todos, todo)
	}

	for resultAppointments.Next() {
		var appointment handlers.Appointment
		err := resultAppointments.Scan(
			&appointment.Id,
			&appointment.Userid,
			&appointment.Title,
			&appointment.Description,
			&appointment.Date,
			&appointment.IsAllDay,
			&appointment.StartTime,
			&appointment.EndTime,
			&appointment.Location,
			&appointment.Category.ID,
			&appointment.Category.Term,
			&appointment.Category.Color,
		)
		if err != nil {
			http.Error(res, err.Error(), http.StatusInternalServerError)
			return
		}
		backup.Appointments = append(backup.Appointments, appointment)
	}

	for resultCategories.Next() {
		var category handlers.Category
		err := resultCategories.Scan(&category.ID, &category.Term, &category.Color, &category.UserId, &category.IsDefault)
		if err != nil {
			http.Error(res, err.Error(), http.StatusInternalServerError)
			return
		}
		backup.Categories = append(backup.Categories, category)
	}

	BackupJSON, err := json.Marshal(backup)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	res.Header().Set("Content-Type", "application/json")
	res.WriteHeader(http.StatusOK)
	res.Write(BackupJSON)
}
