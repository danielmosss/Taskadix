package GET

import (
	"api/functions"
	"api/handlers"
	"encoding/json"
	"net/http"
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

	todayDate := time.Now().Format(time.DateOnly)
	endDate := time.Now().Add(7 * 24 * time.Hour).Format(time.DateOnly)

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
	for i := 0; i < 7; i++ {
		date := time.Now().Add(time.Duration(i) * 24 * time.Hour).Format(time.DateOnly)
		dayName := time.Now().Add(time.Duration(i) * 24 * time.Hour).Format("Monday")
		dayTasks, exists := tasksMap[date]
		if !exists {
			dayTasks = []handlers.TodoCard{} // Empty slice
		}
		weekTasks = append(weekTasks, handlers.DayTodos{Day: dayName, Date: date, Tasks: dayTasks})
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
