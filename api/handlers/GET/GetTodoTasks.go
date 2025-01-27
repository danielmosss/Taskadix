package GET

import (
	"api/functions"
	"api/handlers"
	"encoding/json"
	"net/http"
	"strconv"
	"time"
)

func GetTodoTasks(res http.ResponseWriter, req *http.Request) {
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

	daysStr := req.URL.Query().Get("days")
	if daysStr == "" {
		http.Error(res, "Days parameter is required", http.StatusBadRequest)
		return
	}

	// check if days is a valid number
	daysInt, err := strconv.Atoi(daysStr)
	if err != nil {
		http.Error(res, "Invalid days parameter", http.StatusBadRequest)
		return
	}

	todayDate := time.Now().Format(time.DateOnly)
	endDate := time.Now().Add(time.Duration(daysInt) * 24 * time.Hour).Format(time.DateOnly)

	query := `SELECT id, title, description, date, todoOrder, checked, isCHEagenda 
			  FROM todos 
			  WHERE userId = ? 
			    AND date >= ? AND date < ?
			  ORDER BY date ASC, todoOrder ASC;`
	result, err := dbConnection.Query(query, userId, todayDate, endDate)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}
	defer result.Close()

	tasksMap := make(map[string][]handlers.TodoCard)
	for result.Next() {
		var task handlers.TodoCard
		err := result.Scan(&task.Id, &task.Title, &task.Description, &task.Date, &task.TodoOrder, &task.Checked, &task.IsCHE)
		if err != nil {
			http.Error(res, err.Error(), http.StatusInternalServerError)
			return
		}
		tasksMap[task.Date] = append(tasksMap[task.Date], task)
	}

	var weekTasks []handlers.DayTodos
	for i, task := range tasksMap {
		// i = 2025-01-25
		if err != nil {
			http.Error(res, err.Error(), http.StatusInternalServerError)
			return
		}

		dayName, err := time.Parse(time.DateOnly, i)
		if err != nil {
			http.Error(res, err.Error(), http.StatusInternalServerError)
			return
		}
		date := dayName.Format("Monday")
		weekTasks = append(weekTasks, handlers.DayTodos{Day: date, Date: i, Tasks: task})
	}

	tasksJSON, err := json.Marshal(weekTasks)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	res.Header().Set("Content-Type", "application/json")
	res.WriteHeader(http.StatusOK)
	res.Write(tasksJSON)
}
